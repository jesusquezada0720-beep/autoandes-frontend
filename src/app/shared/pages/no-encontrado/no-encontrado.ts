import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-no-encontrado', standalone: true, imports: [RouterLink], template: `<section class="message-page"><span class="message-code">404</span><h1>Página no encontrada</h1><p>La dirección que buscas no existe.</p><a routerLink="/inicio" class="button primary">Ir al inicio</a></section>`, styles: [`.message-page{min-height:80vh;display:grid;align-content:center;justify-items:center;text-align:center;padding:24px}.message-code{color:#55a88b;font-size:64px;font-weight:800}h1{color:#183840;margin:6px}p{color:#74878c;margin:0 0 22px}.button{padding:11px 18px;border-radius:7px;text-decoration:none}.primary{background:#173941;color:#fff}`] })
export class NoEncontradoComponent {}
