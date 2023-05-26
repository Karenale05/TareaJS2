class Producto {
  sku; 
  nombre; 
  categoria; 
  precio; 
  stock; 

  constructor(sku, nombre, precio, categoria, stock) {
    this.sku = sku;
    this.nombre = nombre;
    this.categoria = categoria;
    this.precio = precio;

 
    if (stock) {
      this.stock = stock;
    } else {
      this.stock = 10;
    }
  }
}

const queso = new Producto("KS944RUR", "Queso", 10, "lacteos", 4);
const gaseosa = new Producto("FN312PPE", "Gaseosa", 5, "bebidas");
const cerveza = new Producto("PV332MJ", "Cerveza", 20, "bebidas");
const arroz = new Producto("XX92LKI", "Arroz", 7, "alimentos", 20);
const fideos = new Producto("UI999TY", "Fideos", 5, "alimentos");
const lavandina = new Producto("RT324GD", "Lavandina", 9, "limpieza");
const shampoo = new Producto("OL883YE", "Shampoo", 3, "higiene", 50);
const jabon = new Producto("WE328NJ", "Jabon", 4, "higiene", 3);

const productosDelSuper = [
  queso,
  gaseosa,
  cerveza,
  arroz,
  fideos,
  lavandina,
  shampoo,
  jabon,
];

class Carrito {
  productos; 
  categorias; 
  precioTotal; 

  constructor() {
    this.precioTotal = 0;
    this.productos = [];
    this.categorias = [];
  }


  async agregarProducto(sku, cantidad) {
    console.log(`Agregando ${cantidad} ${sku}`);

    let producto;

    try {
      producto = await findProductBySku(sku);
    } catch (errorDeProducto) {
      console.log("El producto no fue encontrado: ");
      return;
    }

    console.log("Producto encontrado", producto);

    let productoExiste = false;
    for (let indice = 0; indice < this.productos.length; indice++) {
      let skuProductoActual = this.productos[indice].sku;
      if (skuProductoActual == sku) {
        this.productos[indice].cantidad += cantidad;
        productoExiste = true;
      }
    }

    if (!productoExiste) {
      const nuevoProducto = new ProductoEnCarrito(
        sku,
        producto.nombre,
        cantidad
      );
      this.productos.push(nuevoProducto);
    }

    let categoriaEncontrada = false;

    for (let indice = 0; indice < this.categorias.length; indice++) {
      let skuProductoActual = this.categorias[indice];

      if (skuProductoActual === producto.categoria) {
        categoriaEncontrada = true;
      }
    }

    if (!categoriaEncontrada) {
      this.categorias.push(producto.categoria);
    }

    this.precioTotal = this.precioTotal + producto.precio * cantidad;
  }

  async eliminarProducto(sku, cantidad) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let productoEncontrado = false;
        for (let indice = 0; indice < this.productos.length; indice++) {
          let skuProductoActual = this.productos[indice].sku;
          if (skuProductoActual == sku) {
            let mensaje = ""
            if (cantidad < skuProductoActual.cantidad) {
              this.productos[indice].cantidad -= cantidad;
              mensaje = `Quedaron ${this.productos[indice].cantidad}, unidades del producto ${sku}`
            } else {
              this.productos.splice(indice, 1);
              mensaje = `El producto ${sku} fue eliminado`
            }
            productoEncontrado = true;
            resolve(mensaje)
          }
        }
        if (!productoEncontrado) {
            reject("Lo sentimos, el producto no existe");
        }
      }, 1500);
    });
  }
}

class ProductoEnCarrito {
  sku;
  nombre;
  cantidad;

  constructor(sku, nombre, cantidad) {
    this.sku = sku;
    this.nombre = nombre;
    this.cantidad = cantidad;
  }
}

function findProductBySku(sku) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const foundProduct = productosDelSuper.find(
        (product) => product.sku === sku
      );
      if (foundProduct) {
        resolve(foundProduct);
      } else {
        reject(`Product ${sku} not found`);
      }
    }, 1500);
  });
}

async function start() {
  const carrito = new Carrito();
  await carrito.agregarProducto("WE328NJ", 1);
  await carrito.agregarProducto("WE328NJ", 2);
  await carrito.agregarProducto("XX92LKI", 2);
  await carrito.agregarProducto("FN312PPE", 5)  

  carrito.eliminarProducto("FN312PPE", 5).then((mensaje =>{
    console.log(mensaje);
  })).catch ((error)=>{
    console.log(error)
  })

  console.log(carrito.productos);
}

start();
