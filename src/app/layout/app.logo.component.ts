import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-logo',
  template: `
    <svg width="85" height="63" viewBox="0 0 85 63"  xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M27.017 30.3135C27.0057 30.5602 27 30.8085 27 31.0581C27 39.9267 34.1894 47.1161 43.0581 47.1161C51.9267 47.1161 59.1161 39.9267 59.1161 31.0581C59.1161 30.8026 59.1102 30.5485 59.0984 30.2959C60.699 30.0511 62.2954 29.7696 63.8864 29.4515L64.0532 29.4181C64.0949 29.9593 64.1161 30.5062 64.1161 31.0581C64.1161 42.6881 54.6881 52.1161 43.0581 52.1161C31.428 52.1161 22 42.6881 22 31.0581C22 30.514 22.0206 29.9747 22.0612 29.441L22.1136 29.4515C23.7428 29.7773 25.3777 30.0646 27.017 30.3135ZM52.4613 18.0397C49.8183 16.1273 46.5698 15 43.0581 15C39.54 15 36.2862 16.1313 33.6406 18.05C31.4938 17.834 29.3526 17.5435 27.221 17.1786C31.0806 12.7781 36.7449 10 43.0581 10C49.3629 10 55.0207 12.7708 58.8799 17.1612C56.7487 17.5285 54.6078 17.8214 52.4613 18.0397ZM68.9854 28.4316C69.0719 29.2954 69.1161 30.1716 69.1161 31.0581C69.1161 45.4495 57.4495 57.1161 43.0581 57.1161C28.6666 57.1161 17 45.4495 17 31.0581C17 30.1793 17.0435 29.3108 17.1284 28.4544L12.2051 27.4697C12.0696 28.6471 12 29.8444 12 31.0581C12 48.211 25.9052 62.1161 43.0581 62.1161C60.211 62.1161 74.1161 48.211 74.1161 31.0581C74.1161 29.8366 74.0456 28.6317 73.9085 27.447L68.9854 28.4316ZM69.6705 15.0372L64.3929 16.0927C59.6785 9.38418 51.8803 5 43.0581 5C34.2269 5 26.4218 9.39306 21.7089 16.1131L16.4331 15.0579C21.867 6.03506 31.7578 0 43.0581 0C54.3497 0 64.234 6.02581 69.6705 15.0372Z" />
      <mask id="path-2-inside-1" fill="white">
        <svg height="85" width="63" xmlns="http://www.w3.org/2000/svg">
          <text x="33" y="40" font-size="30" >{{letra}}</text>
        </svg>
      </mask>
      <path d="M0 14L5.87269 -3.01504L-12.6052 26.8495L0 14ZM42.5 28.9252L41.5954 10.948L42.5 28.9252ZM85 14L96.4394 27.8975L79.1273 -3.01504L85 14ZM0 14C-12.6052 26.8495 -12.5999 26.8546 -12.5946 26.8598C-12.5928 26.8617 -12.5874 26.8669 -12.5837 26.8706C-12.5762 26.8779 -12.5685 26.8854 -12.5605 26.8932C-12.5445 26.9088 -12.5274 26.9254 -12.5092 26.943C-12.4729 26.9782 -12.4321 27.0174 -12.387 27.0605C-12.2969 27.1467 -12.1892 27.2484 -12.0642 27.3646C-11.8144 27.5968 -11.4949 27.8874 -11.1073 28.2273C-10.3332 28.9063 -9.28165 29.7873 -7.96614 30.7967C-5.34553 32.8073 -1.61454 35.3754 3.11693 37.872C12.5592 42.8544 26.4009 47.7581 43.4046 46.9025L41.5954 10.948C32.6449 11.3983 25.2366 8.83942 19.9174 6.03267C17.2682 4.63475 15.2406 3.22667 13.9478 2.23478C13.3066 1.74283 12.8627 1.366 12.6306 1.16243C12.5151 1.06107 12.4538 1.00422 12.4485 0.999363C12.446 0.996981 12.4576 1.00773 12.4836 1.03256C12.4966 1.04498 12.5132 1.06094 12.5334 1.08055C12.5436 1.09035 12.5546 1.10108 12.5665 1.11273C12.5725 1.11855 12.5787 1.12461 12.5852 1.13091C12.5884 1.13405 12.5934 1.13895 12.595 1.14052C12.6 1.14548 12.6052 1.15049 0 14ZM43.4046 46.9025C59.3275 46.1013 72.3155 41.5302 81.3171 37.1785C85.8337 34.9951 89.4176 32.8333 91.9552 31.151C93.2269 30.3079 94.2446 29.5794 94.9945 29.0205C95.3698 28.7409 95.6788 28.503 95.92 28.3138C96.0406 28.2192 96.1443 28.1366 96.2309 28.067C96.2742 28.0321 96.3133 28.0005 96.348 27.9723C96.3654 27.9581 96.3817 27.9448 96.3969 27.9323C96.4045 27.9261 96.4119 27.9201 96.419 27.9143C96.4225 27.9114 96.4276 27.9072 96.4294 27.9057C96.4344 27.9016 96.4394 27.8975 85 14C73.5606 0.102497 73.5655 0.0985097 73.5703 0.0945756C73.5718 0.0933319 73.5765 0.0894438 73.5795 0.0869551C73.5856 0.0819751 73.5914 0.077195 73.597 0.0726136C73.6082 0.0634509 73.6185 0.055082 73.6278 0.0474955C73.6465 0.0323231 73.6614 0.0202757 73.6726 0.0112606C73.695 -0.00676378 73.7026 -0.0126931 73.6957 -0.00726687C73.6818 0.00363418 73.6101 0.0596753 73.4822 0.154983C73.2258 0.346025 72.7482 0.691717 72.0631 1.14588C70.6873 2.05798 68.5127 3.38259 65.6485 4.7672C59.8887 7.55166 51.6267 10.4432 41.5954 10.948L43.4046 46.9025ZM85 14C79.1273 -3.01504 79.1288 -3.01557 79.1303 -3.01606C79.1306 -3.01618 79.1319 -3.01664 79.1326 -3.01688C79.134 -3.01736 79.135 -3.0177 79.1356 -3.01791C79.1369 -3.01834 79.1366 -3.01823 79.1347 -3.01759C79.131 -3.01633 79.1212 -3.01297 79.1055 -3.00758C79.0739 -2.99681 79.0185 -2.97794 78.9404 -2.95151C78.7839 -2.89864 78.5366 -2.81564 78.207 -2.7068C77.5472 -2.48895 76.561 -2.16874 75.3165 -1.78027C72.8181 -1.00046 69.3266 0.039393 65.3753 1.07466C57.0052 3.26771 48.2826 4.97383 42.5 4.97383V40.9738C53.2174 40.9738 65.7448 38.193 74.4997 35.8992C79.1109 34.691 83.1506 33.4874 86.0429 32.5846C87.4937 32.1318 88.6676 31.7509 89.4942 31.478C89.9077 31.3414 90.2351 31.2317 90.4676 31.1531C90.5839 31.1138 90.6765 31.0823 90.7443 31.0591C90.7783 31.0475 90.806 31.038 90.8275 31.0306C90.8382 31.0269 90.8473 31.0238 90.8549 31.0212C90.8586 31.0199 90.862 31.0187 90.865 31.0177C90.8665 31.0172 90.8684 31.0165 90.8691 31.0163C90.871 31.0156 90.8727 31.015 85 14ZM42.5 4.97383C36.7174 4.97383 27.9948 3.26771 19.6247 1.07466C15.6734 0.039393 12.1819 -1.00046 9.68352 -1.78027C8.43897 -2.16874 7.4528 -2.48895 6.79299 -2.7068C6.46337 -2.81564 6.21607 -2.89864 6.05965 -2.95151C5.98146 -2.97794 5.92606 -2.99681 5.89453 -3.00758C5.87876 -3.01297 5.86897 -3.01633 5.86528 -3.01759C5.86344 -3.01823 5.86312 -3.01834 5.86435 -3.01791C5.86497 -3.0177 5.86597 -3.01736 5.86736 -3.01688C5.86805 -3.01664 5.86939 -3.01618 5.86973 -3.01606C5.87116 -3.01557 5.87269 -3.01504 0 14C-5.87269 31.015 -5.87096 31.0156 -5.86914 31.0163C-5.8684 31.0165 -5.86647 31.0172 -5.86498 31.0177C-5.86201 31.0187 -5.85864 31.0199 -5.85486 31.0212C-5.84732 31.0238 -5.83818 31.0269 -5.82747 31.0306C-5.80603 31.038 -5.77828 31.0475 -5.74435 31.0591C-5.67649 31.0823 -5.58388 31.1138 -5.46761 31.1531C-5.23512 31.2317 -4.9077 31.3414 -4.49416 31.478C-3.66764 31.7509 -2.49366 32.1318 -1.04289 32.5846C1.84938 33.4874 5.88908 34.691 10.5003 35.8992C19.2552 38.193 31.7826 40.9738 42.5 40.9738V4.97383Z"  mask="url(#path-2-inside-1)"/>
    </svg>
  `
})
export class LogoComponent {
  @Input() letra: string = 'A';
  @Input() colorScheme: 'light' | 'dark' = 'light';
}