import fs from 'fs'
class ProductManager{
    #path
    #format
    
    constructor (path){
        this.#path = path;
        this.#format = 'utf-8'
    }

     
    generateId= (productos) =>{
        return (productos.length === 0) ? 1 : productos[productos.length-1].id + 1
    }
    
    addProduct = async (product) => {
        const productos =await this.getProducts()
        
        const newProduct = {
            ...product,
            id:this.generateId(productos)
        }
        productos.push(newProduct);
        
         return await fs.promises.writeFile(this.#path,JSON.stringify(productos,null,'\t'))
    }
    updateProduct = async (id, producto)=> {
       
        const productos = await this.getProducts()
        let encontrado = productos.find((producto)=>producto.code===id)
        if( encontrado !== undefined){
            let nuevo = { // creo un nuevo producto guardandome el ID anterior
                id:      encontrado.id,
                title:   producto.title,
                price:   producto.price,
                thumnail:producto.thumnail,
                code:    producto.code,
                stock:   producto.stock
            }
            let nuevosProductos = productos.filter(produ =>produ.code!==id) // filtro y saco al que no me sirve
           
            nuevosProductos.push(nuevo)// agrego el producto actualizado al array
             return await fs.promises.writeFile(this.#path, JSON.stringify(nuevosProductos,null,'\t')) //grabo en archivo
        }return false
       
    }
    deleteProduct = async (id) => {
        const productos = await this.getProducts()
        const yaEliminado = productos.filter((product) => product.code!==id)
         return await fs.promises.writeFile(this.#path, JSON.stringify(yaEliminado,null,'\t')) //grabo en archivo
    }

    getProducts = async () =>{
        return JSON.parse(await fs.promises.readFile(this.#path,this.#format))
        
    }
    getProductById = async (id) => {
        const productos = await this.getProducts()
        let encontrado = productos.find((producto)=> producto.code===id)
        if (encontrado===undefined){
            return 'el producto no existe' // si no lo encontre devuelve falso
        }else{
           
            return encontrado // si lo encontre devuelve el objeto
        }
    }
    

}


/// PRUEBAS DEL PROGRAMA---------------------------------------------------------------------------

const fileName = './productos.json'
const manager = new ProductManager(fileName)

manager.getProducts().then((productos)=>console.log(productos))

const newProduct = {
    
    title:'PRODUCTO NUEVO',
    price: 13500,
    thumnail: 'image.png',
    code:17000,
    stock:500

}
manager.addProduct(newProduct)
manager.getProductById(14000).then ((producto)=>console.log(producto))

const toUpdateProduct = {
    title:'PRODUCTO ACTUALIZADO',
    price: 10000,
    thumnail: 'image.png',
    code:12000,
    stock:7000

}
// manager.updateProduct(13700,toUpdateProduct)
// manager.deleteProduct(13600)
