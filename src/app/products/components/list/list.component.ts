import { Component, OnInit } from '@angular/core';

// Detector de cambios
import { ChangeDetectorRef, AfterContentChecked} from '@angular/core';

// PrimeNG
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

// Models
import { Categoria } from 'src/app/shared/models/categoria';
import { Producto } from 'src/app/shared/models/product';
import { UnidadMedida } from 'src/app/shared/models/unidadMedida';
import { Actividad } from 'src/app/shared/models/actividad';

// Services
import { ProductsService } from '../../services/products/products.service';
import { CategoriesService } from 'src/app/generaldata/services/categories/categories.service';
import { UnitsService } from 'src/app/generaldata/services/units/units.service';
import { PaginacionService } from 'src/app/shared/services/helpers/paginacion.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  styles: [`
  :host ::ng-deep .p-dialog .product-image {
      width: 150px;
      margin: 0 auto 2rem auto;
      display: block;
  }
`],
providers: [MessageService,ConfirmationService]
})

export class ListComponent implements OnInit {

  ventanaModal!: boolean;
  puedeEditarId! : boolean;
  intentoGuardar!: boolean;

  listaActividades:Actividad[] = [
    {
      codigoCaeb: 610000,
      descripcion: "TELECOMUNICACIONES",
      tipoActividad: "P"
    },
    {
      codigoCaeb: 461021,
      descripcion: "ACTIVIDADES DE COMISIONISTAS, CORREDORES DE PRODUCTOS BÁSICOS, SUBASTADORES",
      tipoActividad: "S"
    }
  ];

  listaActividadesFiltrada :Actividad[]=this.listaActividades;

  listaTipos = [
    {
      tipoproducto: 'P',
      descripcion : 'PRODUCTO'
    },
    {
      tipoproducto: 'S',
      descripcion : 'SERVICIO'
    },
  ]

  listaCategorias! : Categoria[];
  listaCategoriasFiltrada! : Categoria[];

  listaUnidadesMedida! : UnidadMedida[];

  listaProductos! : Producto[];

  producto : Producto= {
    codigoproducto : "",
    nombreproducto : '',
    tipoproducto : '',
    precio : 0.00,
    codigounidadmedida : '0',
    codigocategoria : 0,
    activo : true,
    codigocategoriaNavigation: {
      codigocategoria : 0,
      codigoactividad : 0,
      codigoproductosin : 0,
      descripcionproducto : "",
      activo : true,
      productos : []
    },
    facturadetalles : []
  }

  //variables para la paginacion
  metadata : any;
  total = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageSize = 5;
  pageIndex : number = 0;
  filtro = "";
  filtroEstado : boolean = true;

  // Variables generales
  token! : string;
  
  private datosLocalStorage = {
    tk: '',
    nu: '',
    cr: -1,
    cpdv : -1,
    cs: -1
  }

  constructor( 
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private unitsService: UnitsService,
    private cdref: ChangeDetectorRef, 
    private PaginacionService : PaginacionService,
    private messageService: MessageService, 
    private confirmationService: ConfirmationService, 
    private primengConfig: PrimeNGConfig
  ) { }

  ngOnInit() {
    this.PaginacionService.Filtro.filter = '';
    this.PaginacionService.Filtro.PageSize = 5;
    this.PaginacionService.Filtro.PageNumber = 1;
    this.primengConfig.ripple = true;

    this.primengConfig.ripple = true;

    // Recuperando datos del localStorage
    this.datosLocalStorage = JSON.parse( localStorage.getItem('dtls') as any );
    if(this.datosLocalStorage != null) {
        this.token = this.datosLocalStorage.tk;
    };

    if(this.token!= null){
      this.cargarListas();
    }
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  cargarListas(){
    this.cargarListaProductos();
    this.cargarListaCategorias();
    this.cargarListaUnidadesMedida();
  }

  cargarListaProductos(){
    this.productsService.listaPaginada(this.token, this.filtroEstado).subscribe((lista : any) => {
      this.listaProductos = lista.data as Producto[];
      this.metadata = lista.meta;
      this.total = this.metadata.totalCount;
      this.pageSize = this.metadata.pageSize;
    });
  }

  cargarListaCategorias(){
    this.categoriesService.obtenerLista(this.token).subscribe(lista => {
      this.listaCategorias = lista as Categoria[];
      this.listaCategoriasFiltrada = this.listaCategorias;
    });
  }

  cargarListaUnidadesMedida(){
    this.unitsService.obtenerLista(this.token).subscribe(lista=> {
      this.listaUnidadesMedida = lista as UnidadMedida[];
    })
  }

  inicializarProducto():Producto{
    let producto : Producto = {
      codigoproducto : "",
      nombreproducto : '',
      tipoproducto : '',
      precio : 0.00,
      codigounidadmedida : '0',
      codigocategoria : 0,
      activo : true,
      codigocategoriaNavigation: {
        codigocategoria : 0,
        codigoactividad : 0,
        codigoproductosin : 0,
        descripcionproducto : "",
        activo : true,
        productos : []
      },
      facturadetalles : []
    }

    return producto;
  }

  abrirModalNuevoDato() {
    this.producto = this.inicializarProducto();
    this.puedeEditarId = true;
    this.intentoGuardar = false;
    this.ventanaModal = true;
  }

  abriModalEditarDato(product: Producto) {
    this.producto = {...product};
    this.producto.codigounidadmedida = this.producto.codigounidadmedida+"";
    this.puedeEditarId = false;

    this.actualizarListaActividades( new Event(""));
    this.actualizarListaCategorias( new Event(""));
    this.ventanaModal = true;
  }

  abrirModalEliminarDato(producto: Producto) {
    this.confirmationService.confirm({
        message: '¿Está seguro que quiere deshabilitar el producto ' + producto.nombreproducto + '?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel : 'Si',
        accept: () => {
          this.productsService.eliminar(this.token,producto.codigoproducto).subscribe(data => {
            this.cargarListaProductos();
          });
          this.producto = this.inicializarProducto();
          this.messageService.add({severity:'warn', summary: 'EXITO', detail: 'PRODUCTO DESHABILITADO', life: 3000});
        }
    });
  }

  abrirModalHabilitarDato(producto: Producto) {
    this.confirmationService.confirm({
        message: '¿Está seguro que quiere habilitar el producto ' + producto.nombreproducto + '?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel : 'Si',
        accept: () => {
          this.productsService.habilitar(this.token,producto.codigoproducto).subscribe(data => {
            this.cargarListaProductos();
          });
          this.producto = this.inicializarProducto();
          this.messageService.add({severity:'success', summary: 'EXITO', detail: 'PRODUCTO HABILITADO', life: 3000});
        }
    });
  }

  ocultarModal() {
    this.ventanaModal = false;
    this.intentoGuardar = false;
  }

  guardarDatos() {
    this.intentoGuardar = true;

    if(!this.validarDatos()){
      return false;
    }else{
      let indiceElemento = this.buscarPorId(this.producto.codigoproducto);
      if (indiceElemento != -1) {
          this.productsService.modificar(this.token,this.producto).subscribe(data => {
            
            this.cargarListaProductos();
            this.messageService.add({severity:'success', summary: 'EXITO', detail: 'PRODUCTO ACTUALIZADO', life: 3000});
          });
      }
      else {

          this.productsService.agregar(this.token,this.producto).subscribe(data =>{
            this.cargarListaProductos();
            this.messageService.add({severity:'success', summary: 'EXITO', detail: 'PRODUCTO GUARDADO', life: 3000});
          });
      }
      this.ventanaModal = false;
      this.producto = this.inicializarProducto();
      return true;
    }
  }

  buscarPorId(id: string): number {
    let index = -1;
    for (let i = 0; i < this.listaProductos.length; i++) {
      if (this.listaProductos[i].codigoproducto === id) {
          index = i;
          break;
      }
    }
    return index;
  }

  validarDatos():boolean{
    return this.validarNombre() && this.validarCodigoProducto() && this.validarTipoProducto() && this.validarPrecio(this.producto.precio) 
    && this.validarUnidadMedida() && this.validarCategoria() && this.validarActividad();
  }

  validarCodigoProducto() : boolean {
    return !(this.producto.codigoproducto == "" || this.producto.codigoproducto.length > 5);
  }

  validarNombre() : boolean {
    return !(this.producto.nombreproducto == "" || this.producto.nombreproducto.length > 100);
  }

  validarTipoProducto() : boolean {
    return !(this.producto.tipoproducto.length > 1);
  }

  validarPrecio(precio: number):boolean{
    return !(isNaN(precio) || precio <= 0.00 || precio+"" == "");
  }

  validarUnidadMedida() : boolean{
    return !(this.producto.codigounidadmedida == '0');
  }

  validarCategoria() : boolean{
    return !(this.producto.codigocategoria == 0 || this.producto.codigocategoria == null);
  }

  validarActividad() : boolean {
    return !(this.producto.codigocategoriaNavigation.codigoactividad == null || this.producto.codigocategoriaNavigation.codigoactividad == -1);
  }

  actualizarListaActividades(event : Event) {
    this.listaActividadesFiltrada = this.listaActividades.filter( actividad => (
      actividad.tipoActividad == this.producto.tipoproducto
    ));
  }

  actualizarListaCategorias(event : Event) {
    this.listaCategoriasFiltrada = this.listaCategorias.filter( categoria => (
      categoria.codigoactividad == this.producto.codigocategoriaNavigation.codigoactividad
    ));
  }

  //Para paginación y filtrado
  paginate(event:any) {
    this.pageIndex=event.first ;
    this.PaginacionService.Filtro.PageNumber = event.page+1;
    this.PaginacionService.Filtro.PageSize = event.rows;
    this.cargarListaProductos();
  }

  filtrar() {
    this.pageIndex = 0;
    this.PaginacionService.Filtro.filter = this.filtro;
    this.PaginacionService.Filtro.PageNumber = 1;
    this.PaginacionService.Filtro.PageSize = 5;
    this.cargarListaProductos();
  }

}
