import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import Drawflow from 'drawflow';
import { ActivatedRoute, Router } from '@angular/router';
import { State, Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { AppState } from '../../app.state';
import { incrementarRequest } from '../../state/actions/estado.actions';
import { getClaseRequest } from '../state/actions/clase.actions';

interface ProcessNode {
  id: string;
  type: 'process' | 'decision' | 'document' | 'area';
  title: string;
  config?: {
    timeEstimate?: number;
    requiredDocs?: string[];
    conditions?: string[];
    color?: string;
    description?: string;
    position?: {
      x: number;
      y: number;
    };
    containedNodes?: any[];
  };
}

@Component({
  selector: 'app-workflow',
  providers: [ConfirmationService, MessageService],
  templateUrl: './workflow.component.html',
  styleUrl: './workflow.component.scss'
})
export class WorkflowComponent implements OnInit {
  @ViewChild('drawflow') drawflowContainer!: ElementRef;
  
  editor: any;
  selectedNode: ProcessNode | null = null;
  isDraggingOver: boolean = false;
  zoom: number = 1;
  isGridEnabled: boolean = true;
  onNodeCreated: any;
  onNodeRemoved: any;
  onNodeSelected: any;
  onConnectionCreated: any; 
  clase: any;

  availableComponents = [
   
  ];

  processSections = [
    { id: 'basic-info', title: 'Información Básica', enabled: true },
    { id: 'requirements', title: 'Requisitos del Proceso', enabled: true },
    { id: 'documents', title: 'Documentos Requeridos', enabled: true },
    { id: 'time', title: 'Tiempos Estimados', enabled: true }
  ];

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private action$: Actions
  ) {
    // Inicializar las funciones de manejo de eventos
    this.onNodeCreated = (node: any) => {
      console.log('Nodo creado:', node);
      // Aquí puedes agregar la lógica adicional que necesites cuando se crea un nodo
    };

    this.onNodeRemoved = (nodeId: string) => {
      console.log('Nodo eliminado:', nodeId);
      if (this.selectedNode && this.selectedNode.id === nodeId) {
        this.selectedNode = null;
      }
    };

    this.onNodeSelected = (node: any) => {
      console.log('Nodo seleccionado:', node);
      this.selectedNode = node.data;
    };

    this.onConnectionCreated = (connection: any) => {
      console.log('Conexión creada:', connection);
      // Aquí puedes agregar la lógica adicional que necesites cuando se crea una conexión
    };
  }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      let data = JSON.parse(atob(params['clase']));
      this.clase = data.clase;
      console.log('Clase:', this.clase);
    });
   // this.store.dispatch(incrementarRequest({request: 1}));  
    
  }

  ngAfterViewInit() {
    this.initDrawflow();
  }

  initDrawflow() {
    this.editor = new Drawflow(this.drawflowContainer.nativeElement);
    
    // Configuración mejorada de Drawflow
    this.editor.reroute = true;
    this.editor.curvature = 0.7;
    this.editor.reroute_fix_curvature = true;
    this.editor.reroute_width = 6;
    this.editor.line_path = 3;
    this.editor.force_first_input = false;
    this.editor.multiple_connection_inputs = false;
    this.editor.multiple_connection_outputs = false;
    this.editor.zoom = 1;
    this.editor.zoom_max = 1.6;
    this.editor.zoom_min = 0.5;
    this.editor.zoom_value = 0.1;
    this.editor.grid_size = this.isGridEnabled ? 20 : 1;

    // Inicializar el módulo Home
    this.editor.start();

    // Configurar eventos después de la inicialización
    this.setupDrawflowEvents();
  }

  setupDrawflowEvents() {
    this.editor.on('nodeCreated', (nodeId: string) => {
      try {
        const node = this.editor.getNodeFromId(nodeId);
        if (node) {
          console.log('Nodo creado:', node);
        }
      } catch (error) {
        console.error('Error al procesar nodo creado:', error);
      }
    });

    this.editor.on('nodeRemoved', (nodeId: string) => {
      try {
        console.log('Nodo eliminado:', nodeId);
        if (this.selectedNode && this.selectedNode.id === nodeId) {
          this.selectedNode = null;
        }
      } catch (error) {
        console.error('Error al procesar nodo eliminado:', error);
      }
    });

    this.editor.on('nodeSelected', (nodeId: string) => {
      try {
        const node = this.editor.getNodeFromId(nodeId);
        if (node && node.data) {
          this.selectedNode = {
            id: nodeId,
            type: node.data.type,
            title: node.data.title,
            config: node.data.config || {}
          };
          console.log('Nodo seleccionado:', this.selectedNode);
        }
      } catch (error) {
        console.error('Error al procesar nodo seleccionado:', error);
        this.selectedNode = null;
      }
    });

    this.editor.on('nodeUnselected', () => {
      this.selectedNode = null;
    });

    this.editor.on('connectionCreated', (connection: any) => {
      try {
        console.log('Conexión creada:', connection);
        const targetNode = this.editor.getNodeFromId(connection.target_id);
        if (targetNode && targetNode.inputs && targetNode.inputs[connection.target_input]) {
          const existingConnections = targetNode.inputs[connection.target_input].connections;
          
          if (existingConnections && existingConnections.length > 1) {
            this.editor.removeSingleConnection(
              connection.output_id,
              connection.input_id,
              connection.output_class,
              connection.input_class
            );
            
            this.messageService.add({
              severity: 'warn',
              summary: 'Advertencia',
              detail: 'Solo se permite una conexión por entrada'
            });
          }
        }
      } catch (error) {
        console.error('Error al procesar conexión:', error);
      }
    });

    this.editor.on('zoom', (zoom: number) => {
      this.zoom = zoom;
    });

    this.editor.on('translate', () => {
      try {
        this.updateNodePositions();
      } catch (error) {
        console.error('Error al actualizar posiciones:', error);
      }
    });
  }

  updateNodePositions() {
    if (this.editor && this.editor.drawflow && this.editor.drawflow.drawflow) {
      const nodes = this.editor.drawflow.drawflow.Home.data;
      if (nodes) {
        Object.values(nodes).forEach((node: any) => {
          if (node && node.data && node.data.config) {
            node.data.config.position = {
              x: node.pos_x,
              y: node.pos_y
            };
          }
        });
      }
    }
  }

  onDragStart(event: DragEvent, component: any) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('component', JSON.stringify(component));
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const componentData = event.dataTransfer?.getData('component');
    if (!componentData) return;

    const component = JSON.parse(componentData);
    const rect = this.drawflowContainer.nativeElement.getBoundingClientRect();
    const x = (event.clientX - rect.left) / this.zoom;
    const y = (event.clientY - rect.top) / this.zoom;

    // Validación mejorada para áreas
    if (component.type === 'area') {
      const areas = Object.values(this.editor.drawflow.drawflow.Home.data)
        .filter((node: any) => node.data.type === 'area');
      
      if (areas.some((node: any) => node.data.title === component.title)) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Advertencia',
          detail: 'Esta área ya existe en el workflow'
        });
        return;
      }
    }

    this.addNode(component, x, y);
  }

  addNode(component: any, x: number, y: number) {
    try {
      const nodeData = {
        ...component,
        id: `${component.id}-${Date.now()}`,
        config: {
          ...component.config,
          position: { x, y },
          timeEstimate: 0,
          requiredDocs: [],
          conditions: [],
          containedNodes: []
        }
      };

      const html = this.generateNodeHtml(nodeData);
      let inputs = 1;
      let outputs = 1;

      switch (component.type) {
        case 'area':
          inputs = 1;
          outputs = 1;
          break;
        case 'process':
          inputs = 1;
          outputs = 1;
          break;
        case 'decision':
          inputs = 1;
          outputs = 2;
          break;
        case 'document':
          inputs = 1;
          outputs = 1;
          break;
      }

      const nodeId = this.editor.addNode(
        nodeData.type,
        outputs,
        inputs,
        x,
        y,
        nodeData.type,
        nodeData,
        html,
        false
      );

      return nodeId;
    } catch (error) {
      console.error('Error al añadir nodo:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo crear el elemento'
      });
    }
  }

  generateNodeHtml(node: any): string {
    const typeClass = `node-${node.type}`;
    const description = node.config?.description ? 
      `<div class="node-description">${node.config.description}</div>` : '';
    
    let additionalContent = '';
    if (node.type === 'decision') {
      additionalContent = `
        <div class="decision-outputs">
          <span class="output-label">Sí</span>
          <span class="output-label">No</span>
          <span class="output-label">Otro</span>
        </div>
      `;
    }

    return `
      <div class="node-content ${typeClass}">
        <div class="node-header">
          <i class="${node.icon}"></i>
          <span class="node-title">${node.title}</span>
        </div>
        ${description}
        ${additionalContent}
      </div>
    `;
  }

  zoomIn() {
    this.editor.zoom_in();
  }

  zoomOut() {
    this.editor.zoom_out();
  }

  resetZoom() {
    this.editor.zoom_reset();
  }
 

  saveWorkflow() {
    const workflow = this.editor.export();
    console.log('Workflow guardado:', workflow);
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Workflow guardado correctamente'
    });
  }


  removeNodeFromArea(node: any) {
    if (this.selectedNode && this.selectedNode.type === 'area') {
      const index = this.selectedNode.config.containedNodes.findIndex((n: any) => n.id === node.id);
      if (index !== -1) {
        this.selectedNode.config.containedNodes.splice(index, 1);
        this.editor.removeNode(node.id);
      }
    }
  }

 
} 