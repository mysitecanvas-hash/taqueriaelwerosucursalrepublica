/* =========================================================
   TAQUERÍA EL GÜERO
   APP.JS
   Página pública
   ========================================================= */


/* =========================================================
   URL DE NUESTRA API
========================================================= */

const API_URL =
    "https://script.google.com/macros/s/AKfycbzO3R7nWb_u0UwZLjM1Z8zbh1E5cjV6yfxtjv9z_NtnBO13LbfoFBSx9wTCfGElkvW6Kw/exec";


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
                API_URL +
                "?accion=todo&_=" +
                Date.now()
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudo conectar con la API. HTTP " +
                respuesta.status
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
                "La API devolvió un error."
            );

        }


        /*
         * =================================================
         * OBTENER INFORMACIÓN
         *
         * Aceptamos tanto:
         *
         * datos.config
         *
         * como:
         *
         * datos.data.config
         *
         * Esto hace el sistema más resistente.
         * =================================================
         */

        const contenido =
            datos.data || datos;


        const config =
            contenido.config ||
            datos.config ||
            {};


        const productos =
            contenido.productos ||
            datos.productos ||
            [];


        const secciones =
            contenido.secciones ||
            datos.secciones ||
            [];


        console.log(
            "Configuración:",
            config
        );


        console.log(
            "Productos:",
            productos
        );


        console.log(
            "Secciones:",
            secciones
        );


        /*
         * =================================================
         * APLICAR CONFIGURACIÓN
         * =================================================
         */

        aplicarConfiguracion(
            config
        );


        /*
         * =================================================
         * MOSTRAR PRODUCTOS
         * =================================================
         */

        mostrarProductos(
            productos,
            secciones
        );


        console.log(
            "Página cargada correctamente."
        );

    }


    catch (error) {

        console.error(
            "Error cargando el sitio:",
            error
        );

        mostrarError(
            error.message
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
     * =================================================
     * TÍTULO
     * =================================================
     */

    if (config.nombre) {

        document.title =
            config.nombre +
            (
                config.sucursal
                    ? " | " +
                      config.sucursal
                    : ""
            );

    }


    /*
     * =================================================
     * NOMBRE DEL NEGOCIO
     * =================================================
     */

    const nombre =
        document.querySelector(
            ".nav-logo"
        );


    if (
        nombre &&
        config.nombre
    ) {

        nombre.textContent =
            config.nombre;

    }


    /*
     * =================================================
     * SUCURSAL
     * =================================================
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
     * =================================================
     * DIRECCIÓN
     * =================================================
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
     * =================================================
     * WHATSAPP
     * =================================================
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
     * =================================================
     * FACEBOOK
     * =================================================
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
     * =================================================
     * GOOGLE MAPS
     * =================================================
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
    productos,
    secciones
) {

    const contenedor =
        document.getElementById(
            "productos"
        );


    if (!contenedor) {

        console.warn(
            "No existe el elemento #productos."
        );

        return;

    }


    /*
     * Limpiar
     */

    contenedor.innerHTML = "";


    /*
     * Productos activos
     */

    const productosActivos =
        (productos || [])
            .filter(
                function(producto) {

                    return (
                        producto.activo === true
                    );

                }
            );


    /*
     * Sin productos
     */

    if (
        productosActivos.length === 0
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
     * =================================================
     * SI EXISTEN SECCIONES
     * =================================================
     */

    if (
        secciones &&
        secciones.length > 0
    ) {

        const seccionesActivas =
            secciones
                .filter(
                    function(seccion) {

                        return (
                            seccion.activo === true
                        );

                    }
                )
                .sort(
                    function(a, b) {

                        return (
                            Number(a.orden || 0) -
                            Number(b.orden || 0)
                        );

                    }
                );


        seccionesActivas.forEach(
            function(seccion) {

                const productosSeccion =
                    productosActivos
                        .filter(
                            function(producto) {

                                return (
                                    String(
                                        producto.seccion
                                    ) ===
                                    String(
                                        seccion.id
                                    ) ||
                                    String(
                                        producto.seccion
                                    ) ===
                                    String(
                                        seccion.nombre
                                    )
                                );

                            }
                        );


                if (
                    productosSeccion.length === 0
                ) {

                    return;

                }


                const bloque =
                    document.createElement(
                        "section"
                    );


                bloque.className =
                    "menu-section";


                /*
                 * Título
                 */

                const titulo =
                    document.createElement(
                        "h2"
                    );


                titulo.className =
                    "menu-section-title";


                titulo.textContent =
                    seccion.nombre;


                bloque.appendChild(
                    titulo
                );


                /*
                 * Descripción
                 */

                if (
                    seccion.descripcion
                ) {

                    const descripcion =
                        document.createElement(
                            "p"
                        );


                    descripcion.className =
                        "menu-section-description";


                    descripcion.textContent =
                        seccion.descripcion;


                    bloque.appendChild(
                        descripcion
                    );

                }


                /*
                 * Contenedor
                 */

                const lista =
                    document.createElement(
                        "div"
                    );


                lista.className =
                    "menu-section-items";


                productosSeccion.forEach(
                    function(producto) {

                        lista.appendChild(
                            crearTarjetaProducto(
                                producto
                            )
                        );

                    }
                );


                bloque.appendChild(
                    lista
                );


                contenedor.appendChild(
                    bloque
                );

            }
        );


        /*
         * Productos que no pertenecen
         * a una sección activa.
         *
         * Los mostramos también para
         * no perder productos.
         */

        const productosSinSeccion =
            productosActivos.filter(
                function(producto) {

                    return !seccionesActivas.some(
                        function(seccion) {

                            return (
                                String(
                                    producto.seccion
                                ) ===
                                String(
                                    seccion.id
                                ) ||
                                String(
                                    producto.seccion
                                ) ===
                                String(
                                    seccion.nombre
                                )
                            );

                        }
                    );

                }
            );


        if (
            productosSinSeccion.length > 0
        ) {

            const lista =
                document.createElement(
                    "div"
                );


            lista.className =
                "menu-section-items";


            productosSinSeccion.forEach(
                function(producto) {

                    lista.appendChild(
                        crearTarjetaProducto(
                            producto
                        )
                    );

                }
            );


            contenedor.appendChild(
                lista
            );

        }


        return;

    }


    /*
     * =================================================
     * SIN SECCIONES
     * =================================================
     */

    const lista =
        document.createElement(
            "div"
        );


    lista.className =
        "menu-section-items";


    productosActivos.forEach(
        function(producto) {

            lista.appendChild(
                crearTarjetaProducto(
                    producto
                )
            );

        }
    );


    contenedor.appendChild(
        lista
    );

}


/* =========================================================
   CREAR TARJETA DE PRODUCTO
========================================================= */

function crearTarjetaProducto(
    producto
) {

    const tarjeta =
        document.createElement(
            "article"
        );


    tarjeta.className =
        "menu-item";


    tarjeta.dataset.productId =
        producto.id;


    /*
     * =================================================
     * IMAGEN
     * =================================================
     */

    if (
        producto.imagen
    ) {

        const imagen =
            document.createElement(
                "img"
            );


        imagen.className =
            "menu-item-image";


        imagen.src =
            producto.imagen;


        imagen.alt =
            producto.nombre ||
            "Producto";


        imagen.loading =
            "lazy";


        imagen.onerror =
            function() {

                imagen.style.display =
                    "none";

            };


        tarjeta.appendChild(
            imagen
        );


        tarjeta.classList.add(
            "tiene-imagen"
        );

    }


    /*
     * =================================================
     * INFORMACIÓN
     * =================================================
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


    informacion.appendChild(
        nombre
    );


    /*
     * Descripción
     */

    if (
        producto.descripcion
    ) {

        const descripcion =
            document.createElement(
                "p"
            );


        descripcion.textContent =
            producto.descripcion;


        informacion.appendChild(
            descripcion
        );

    }


    tarjeta.appendChild(
        informacion
    );


    /*
     * =================================================
     * PRECIO
     * =================================================
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


    tarjeta.appendChild(
        precio
    );


    return tarjeta;

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


    const numero =
        Number(
            String(precio)
                .replace(
                    /[^0-9.-]/g,
                    ""
                )
        );


    if (
        isNaN(numero)
    ) {

        return "$0";

    }


    return "$" +
        numero.toLocaleString(
            "es-MX",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }
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
   MOSTRAR ERROR
========================================================= */

function mostrarError(
    mensaje
) {

    const contenedor =
        document.getElementById(
            "productos"
        );


    if (!contenedor) {

        return;

    }


    contenedor.innerHTML = `

        <p class="sin-productos">
            No pudimos cargar el menú
            en este momento.
        </p>

    `;


    console.error(
        mensaje
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
