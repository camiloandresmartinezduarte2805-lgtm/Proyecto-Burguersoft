const ingredientesDB = {

    hamburguesa: {
        Sencilla: "Pan artesanal, carne 120g, queso, lechuga, tomate y salsas.",
        Doble: "Pan artesanal, doble carne 240g, doble queso, lechuga, tomate y salsas.",
        Especial: "Carne 150g, queso, tocineta, jamón, huevo, lechuga, tomate y salsas.",
        Pollo: "Pechuga de pollo apanada, queso, lechuga, tomate y salsas."
    },

    perros: {
        Sencillo: "Salchicha, pan perro, ripio de papa, salsas.",
        Especial: "Salchicha, pollo desmechado, queso, ripio, salsas.",
        Americano: "Salchicha americana, queso, cebolla grill, tocineta y salsas."
    },

    pizza: {
        Personal: "Masa artesanal, queso, salsa de tomate, jamón.",
        Mediana: "Masa artesanal, queso, salsa, jamón, maíz, orégano.",
        Familiar: "Masa artesanal, queso doble, jamón, salami, champiñones, orégano."
    },

    salchipapa: {
        Sencilla: "Papa a la francesa, salchicha, salsas.",
        Especial: "Papa, salchicha, pollo, queso gratinado y salsas.",
        Mixta: "Papa, salchicha, carne, pollo, queso y salsas."
    },

    empanadas: {
        Carne: "Masa de maíz, relleno de carne sazonada con papa.",
        Pollo: "Masa de maíz, pollo desmechado con papa y especias.",
        Mixta: "Carne y pollo mezclados con papa."
    },

    papa: {
        Carne: "Papa rellena de carne molida y huevo.",
        Pollo: "Papa rellena de pollo y condimentos."
    },

    pastel: {
        Unidad: "Masa de pastel, pollo desmechado y especias.",
        Combo2: "Dos pasteles rellenos de pollo."
    },

    arepas: {
        Queso: "Arepa de maíz rellena con queso derretido.",
        Huevo: "Arepa rellena con huevo frito."
    },

    chorizo: {
        Sencillo: "Chorizo asado, arepa pequeña, limón.",
        Especial: "Chorizo, queso, tocineta y salsas."
    },

    yuca: {
        Carne: "Pastel de yuca con carne molida.",
        Pollo: "Pastel de yuca con pollo."
    },

    bebidas: {
        CocaCola: "Bebida gaseosa sabor cola.",
        Pepsi: "Gaseosa refrescante sabor cola.",
        Manzana: "Gaseosa sabor manzana.",
        CocaCola15: "Coca-Cola de 1.5L",
        Pepsi15: "Pepsi de 1.5L",
        Colombiana: "Gaseosa tradicional Colombiana.",
        Agua: "Agua potable.",
        Aguagas: "Agua potable con Gas",
        JugoFresa: "Jugo natural de fresa.",
        JugoMora: "Jugo natural de mora.",
        JugoLulo: "Jugo natural de lulo."
    }

};

/* MOSTRAR INGREDIENTES */

function hoverIngredientes(categoria, elemento) {
    const item = elemento.getAttribute("data-item");
    const caja = elemento.parentElement.parentElement.querySelector(".ingredientes-box");

    if (ingredientesDB[categoria] && ingredientesDB[categoria][item]) {
        caja.style.display = "block";
        caja.innerHTML = `<strong>Ingredientes:</strong><br>${ingredientesDB[categoria][item]}`;
    }
}

/* MOSTRAR INGREDIENTES AL HACER CLIC */
function clickIngredientes(categoria, elemento) {
    const item = elemento.getAttribute("data-item");
    const caja = elemento.parentElement.parentElement.querySelector(".ingredientes-box");

    caja.style.display = "block";

    if (ingredientesDB[categoria] && ingredientesDB[categoria][item]) {
        caja.innerHTML = `<strong>Ingredientes:</strong><br>${ingredientesDB[categoria][item]}`;
    }
}

/* MOSTRAR / OCULTAR SUBMENÚS */
function mostrarSubmenu(id) {
    document.querySelectorAll(".submenu").forEach(sm => sm.style.display = "none");

    const submenu = document.getElementById("submenu-" + id);
    if (submenu) submenu.style.display = "block";
}

function volverSubmenu(id) {
    const submenu = document.getElementById("submenu-" + id);
    if (submenu) submenu.style.display = "none";
}
let pedidoRealizado = false;

/* CARRITO */
let carrito = [];

function agregarAlCarrito(nombre, precio) {
    carrito.push({ nombre, precio });
    actualizarCarrito();
    
}

function actualizarCarrito() {
    const lista = document.getElementById("lista-carrito");
    lista.innerHTML = "";

    // agrupar por nombre
        const map = new Map();
        let total = 0;
        carrito.forEach(item => {
        total += Number(item.precio || 0);
        const key = item.nombre || 'Item';
        if(!map.has(key)) map.set(key, { nombre: key, cantidad: 0, precioUnit: Number(item.precio || 0) });
        const entry = map.get(key);
        entry.cantidad += 1;
    });

    // renderizar agrupado
    for(const [k,v] of map.entries()){
        // mostrar precio unitario junto al item; el total se calcula por separado
            const qtyLabel = v.cantidad>1 ? ` x${v.cantidad}` : '';
            const li = document.createElement("li");
            // mostrar precio unitario en el carrito, la suma total mantiene acumulado
            li.textContent = `${v.nombre}${qtyLabel} — $${v.precioUnit}`;
        lista.appendChild(li);
    }

    document.getElementById("total").textContent = "Total: $" + total;
}

function vaciarCarrito() {
    carrito = [];
    actualizarCarrito();
}

/* ENVIAR PEDIDO A WHATSAPP (agrupado) */
function enviarPedido() {
    

    if (carrito.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    // agrupar por nombre
    const map = new Map();
    let total = 0;
    carrito.forEach(item => {
        total += Number(item.precio || 0);
        const key = item.nombre || 'Item';
        if(!map.has(key)) map.set(key, { nombre: key, cantidad: 0, precioUnit: Number(item.precio || 0) });
        const entry = map.get(key);
        entry.cantidad += 1;
    });

    const metodoPago = document.getElementById("pago") ? document.getElementById("pago").value : '-';

    let mensaje = "🛒 Pedido BurgerSoft%0A%0A";
    for(const [k,v] of map.entries()){
        // in message show unit price and quantity; total still sent separately
        const qtyLabel = v.cantidad>1 ? ` x${v.cantidad}` : '';
        mensaje += `• ${v.nombre}${qtyLabel} — $${v.precioUnit}%0A`;
    }

    mensaje += `%0A*TOTAL:* $${total}`;
    mensaje += `%0A*Método de pago:* ${metodoPago}`;

    const telefono = "573224548294";
    window.open("https://wa.me/" + telefono + "?text=" + mensaje);

    pedidoRealizado = true;
    
    const btn = document.getElementById("btn-ver-factura");if(btn) btn.style.display = "block";
    
}
        
function mostrarFactura(){
    actualizarFactura(); // siempre recalcula con lo nuevo del carrito
}
