import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule } from '@angular/common/http';
import { reducers } from './app.state';
import { CentroEffects } from './effects/centro.effects';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        StoreModule.forRoot(reducers),
        EffectsModule.forRoot([CentroEffects])
    ]
})
export class StateModule { } 