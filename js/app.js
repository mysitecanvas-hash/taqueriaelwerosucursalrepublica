/* =========================================================
   TAQUERÍA EL GÜERO
   APP.JS
   Conexión con Google Sheets mediante Apps Script
   ========================================================= */


/* =========================================================
   URL DE NUESTRA API
========================================================= */

const API_URL =
    "https://script.google.com/macros/s/AKfycbyhTrk3B-qa_U5KSYRGZ0VLoo_GcUySiF9WatT2q_O9DCTAZk5-ILEx4r9kxf6iMDGFrg/exec";


/* =========================================================
   CARGAR INFORMACIÓN
========================================================= */

async function cargarSitio() {

    try {

        console.log(
            "Conectando con Taquería El Güero..."
        );


        const respuesta =
            await fetch(
                API_URL + "?accion=todo"
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudo conectar con la API."
            );

        }


        const datos =
            await respuesta.json();


        console.log(
            "Datos recibidos:",
            datos
        );


        if (!datos.ok) {

            throw new Error(
                datos.error ||
                "Error desconocido."
            );

        }


        /*
         * Aplicar configuración
         */

        aplicarConfiguracion(
            datos.config
        );


        /*
         * Mostrar productos
         */

        mostrarProductos(
            datos.productos
        );


        /*
         * Mostrar secciones
         */

        console.log(
            "Secciones:",
            datos.secciones
        );


        console.log(
            "Página cargada correctamente."
        );

    }


    catch (error) {

        console.error(
            "Error:",
            error
        );

    }

}


/* =========================================================
   CONFIGURACIÓN
========================================================= */

function aplicarConfiguracion(
    config
) {

    if (!config) {
        return;
    }


    /*
     * Título del navegador
     */

    if (config.nombre) {

        document.title =
            config.nombre +
            " | " +
            (
                config.sucursal ||
                ""
            );

    }


    /*
     * Nombre del negocio
     */

    const nombre =
        document.querySelector(
            ".nav-logo"
        );

    if (nombre && config.nombre) {

        nombre.textContent =
            config.nombre;

    }


    /*
     * Sucursal
     */

    const sucursal =
        document.querySelector(
            ".hero-badge"
        );

    if (
        sucursal &&
        config.sucursal
    ) {

        sucursal.textContent =
            config.sucursal;

    }


    /*
     * Dirección
     */

    const direccion =
        document.getElementById(
            "direccion"
        );

    if (
        direccion &&
        config.direccion
    ) {

        direccion.textContent =
            config.direccion;

    }


    /*
     * WhatsApp
     */

    if (config.whatsapp) {

        const whatsappURL =
            "https://wa.me/" +
            limpiarTelefono(
                config.whatsapp
            );


        const botonesWhatsApp = [

            "whatsapp-button",

            "footer-whatsapp",

            "floating-whatsapp"

        ];


        botonesWhatsApp.forEach(
            function(id) {

                const boton =
                    document.getElementById(
                        id
                    );


                if (boton) {

                    boton.href =
                        whatsappURL;

                }

            }
        );

    }


    /*
     * Facebook
     */

    if (config.facebook) {

        const facebook =
            document.getElementById(
                "facebook-button"
            );


        if (facebook) {

            facebook.href =
                config.facebook;

        }

    }


    /*
     * Google Maps
     */

    if (config.maps) {

        const maps =
            document.getElementById(
                "maps-link"
            );


        if (maps) {

            maps.href =
                config.maps;

        }

    }

}


/* =========================================================
   MOSTRAR PRODUCTOS
========================================================= */

function mostrarProductos(
    productos
) {

    const contenedor =
        document.getElementById(
            "productos"
        );


    if (!contenedor) {

        console.warn(
            "No existe #productos"
        );

        return;

    }


    /*
     * Limpiar productos actuales
     */

    contenedor.innerHTML = "";


    /*
     * Si no existen productos
     */

    if (
        !productos ||
        productos.length === 0
    ) {

        contenedor.innerHTML = `

            <p class="sin-productos">
                Próximamente agregaremos
                nuestro menú.
            </p>

        `;

        return;

    }


    /*
     * Recorrer productos
     */

    productos.forEach(
        function(producto) {


            /*
             * Productos desactivados
             */

            if (
                producto.activo !== true
            ) {

                return;

            }


            /*
             * Crear tarjeta
             */

            const tarjeta =
                document.createElement(
                    "article"
                );


            tarjeta.className =
                "menu-item";


            tarjeta.dataset.productId =
                producto.id;


            /*
             * Información
             */

            const informacion =
                document.createElement(
                    "div"
                );


            informacion.className =
                "menu-item-info";


            /*
             * Nombre
             */

            const nombre =
                document.createElement(
                    "h3"
                );


            nombre.textContent =
                producto.nombre ||
                "Producto";


            /*
             * Descripción
             */

            const descripcion =
                document.createElement(
                    "p"
                );


            descripcion.textContent =
                producto.descripcion ||
                "";


            /*
             * Precio
             */

            const precio =
                document.createElement(
                    "strong"
                );


            precio.className =
                "price";


            precio.textContent =
                formatearPrecio(
                    producto.precio
                );


            /*
             * Armar tarjeta
             */

            informacion.appendChild(
                nombre
            );


            if (
                producto.descripcion
            ) {

                informacion.appendChild(
                    descripcion
                );

            }


            tarjeta.appendChild(
                informacion
            );


            tarjeta.appendChild(
                precio
            );


            /*
             * Imagen
             *
             * La agregaremos cuando
             * conectemos Google Drive.
             */

            if (
                producto.imagen
            ) {

                tarjeta.classList.add(
                    "tiene-imagen"
                );

            }


            contenedor.appendChild(
                tarjeta
            );

        }
    );

}


/* =========================================================
   FORMATEAR PRECIO
========================================================= */

function formatearPrecio(
    precio
) {

    if (
        precio === undefined ||
        precio === null ||
        precio === ""
    ) {

        return "$0";

    }


    return "$" +
        Number(precio)
            .toLocaleString(
                "es-MX"
            );

}


/* =========================================================
   LIMPIAR TELÉFONO
========================================================= */

function limpiarTelefono(
    telefono
) {

    return String(
        telefono
    ).replace(
        /\D/g,
        ""
    );

}


/* =========================================================
   INICIAR
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        cargarSitio();

    }
);