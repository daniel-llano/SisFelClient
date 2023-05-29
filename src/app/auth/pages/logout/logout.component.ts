import { Component, OnInit } from '@angular/core';
//ROUTEADOR
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})

export class LogoutComponent implements OnInit {

  constructor(private Router: Router) { }

  ngOnInit(): void {
    localStorage.removeItem('datos');
    this.Router.navigate(['/login']);
    setTimeout(() => 
    {
    window.location.reload()
    },0)
  }

}
