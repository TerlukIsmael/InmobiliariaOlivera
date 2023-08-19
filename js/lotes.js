//SECCION PRINCIPAL
const container=document.getElementById('body-dashboard')

//ARREGLO DE LOTES
var loteos = [];

//ARREGLO DE PORCENTAJES
var porcentajes = []

//ARREGLO DE SOCIOS
var socios = []

//ARREGLO DE DEPARTAMENTOS
var departamentos = []



//ARREGLO DE TERRENOS
var terrenos = []

//ARREGLO DE CLIENTES
var clientes = []

//ARREGLO DE ESTADO DEL TERRENO
var estado =[]

//ARREGLO DE TIPO DEL TERRENO
var tipo=[]


function limpiar(){
    container.innerHTML=''
}


async function getLotes(){   

    let index = document.querySelector("#index")
    let navbar = document.querySelector("#nabvar")
    let dashboard = document.querySelector("#dashboard") 
    
    //Preguntamos si tiene la clase
    if(!index.classList.contains("hidden")){
        //Ocultamos inicio
        index.classList.add("hidden")
    
        //Mostramos dashboard
        navbar.classList.remove("hidden")
        dashboard.classList.remove("hidden")
    }
    

    let response;
    try {
        response = await gapi.client.sheets.spreadsheets.values.batchGet({
            spreadsheetId: '1oWd2Nr4qCsJ9sSMrUcEIenZ_0pphDMREbVbVlUx6Ph8',
            ranges: ['Lotes!A:H', 'Lotes!J:L', 'Lotes!N:R', 'Lotes!U:V']
        });


    } catch (err) {
        console.error(err)
        //document.getElementById('content').innerText = err.message;
        return;
    }

    //Evalua la longitud de la response
    const range = response.result.valueRanges;
    if (range.length == 0) {
        console.warn("No se encontraron valores")
        return;
    } 

    // Muestra por pantalla
    //console.log(response.result.valueRanges)

    loteos = convertToObjects(range[0].values)
    porcentajes = convertToObjects(range[1].values)
    socios = convertToObjects(range[2].values)
    departamentos = convertToObjects(range[3].values)

    //console.log(loteos, socios, porcentajes, departamentos)
    
    mostrarLotes(loteos, porcentajes, socios, departamentos);


    //Cargamos el script dinamicamente
    let script = document.createElement('script');
    script.src = 'js/eventos_lotes.js';
    document.body.appendChild(script);

}


function convertToObjects(arrayLotes){
    //Desglozar encabezado y registros
    const [encabezado, ...registros] = arrayLotes;

    //Recorro el arreglo de datos
    const result = registros.map( registro =>{
        //Por cada registro creo un objeto
        const obj = {};
        encabezado.forEach((element,index )=> {
            obj[element.toLowerCase()] = registro[index]
        });
        return obj;
    })

    return result;

}


function mostrarLotes(loteos, porcentajes, socios, departamentos){

    container.innerHTML=""

    //SECTION
    let section = document.createElement("section");
    section.setAttribute("class", "p-8");
    section.setAttribute("id", "section-loteo");
    
    //HEADER LOTEOS
    let header = document.createElement("div");
    header.setAttribute("class", "flex flex-col gap-y-4 mb-8 border-b-2 pb-2");
    header.innerHTML = `
        <div class="flex w-full items-center justify-between">

            <!-- Title -->
            <p class="uppercase text-red-600 font-semibold text-xl ">Loteos</p>

            <div class="flex gap-x-2">
                <!-- Button -->
                <div class="flex items-center border rounded justify-center cursor-pointer bg-red-500 hover:bg-red-600 py-1 px-2 gap-x-2 text-white " id="add-loteo">
                    <i class="flex items-center"><span class="material-icons-round"> add </span></i>
                    <button class=""> Añadir Loteo </button>
                </div>

                <!-- Button -->
                <div class="flex items-center border rounded justify-center cursor-pointer bg-green-600 hover:bg-green-700 py-1 px-2 gap-x-2 text-white" id="update-loteos">
                    <i class="flex items-center"><span class="material-icons-round"> update </span></i>
                    <button class=""> Actualizar </button>
                </div>
            </div>
        </div> 

        <!-- Filtros -->
        <div class="flex items-center justify-between">
            
            <!-- ICON -->
            <div class="flex items-center">
                <i class="flex"><span class="material-icons-round"> filter_alt </span></i>
                <p> Filtros </p>
            </div>

            <!-- Departamento -->
            <div class="flex items-center w-1/4 gap-x-2">
                <p class="tracking-wide">Departamentos:</p>
                <select name="departamentos" id="departamentos" class="border border-2 rounded w-full p-1 cursor-pointer">
                    <option value="0">Todos</option>
                    ${ 
                        departamentos.map( depto => {
                         return createOptionsDptoHTML(depto)
                        }).join('')
                     
                     }
                </select>
            </div>          

            <!-- Nombre -->
            <div class="flex items-center w-1/4 gap-x-2">
                <p>Nombre: </p>
                <input type="search" placeholder="Buscar por nombre" class="p-1 border border-2  w-full rounded focus:outline-none" id="search-loteo-nombre">
            </div>

            <!-- Socio -->
                <div class="flex items-center w-1/4 gap-x-2">
                <p>Socio: </p>
                <input type="search" placeholder="Buscar por socio" class="p-1 border border-2 w-full rounded focus:outline-none" id="search-loteo-socio">
            </div>

        </div>
    `
    
    //BODY CARD
    let div = document.createElement("div");
    div.setAttribute("class", "flex flex-wrap justify-between gap-y-8");

    //CARDS
    loteos.forEach(loteo=>{

        let card_lote = createCardLote(loteo, porcentajes, socios, departamentos)

        div.appendChild(card_lote)

    })

    section.appendChild(header)
    section.appendChild(div)
    container.appendChild(section)
    
}


function createOptionsDptoHTML(depto){
    return `
        <option value="${depto.id_depto}">${depto.nombre}</option>     
    `
}


function createCardLote(loteo, porcentajes, socios, departamentos){
 
    //Obtiene los socios de acuerdo al lote
    let sociosFilters = porcentajes.filter(objeto => objeto.id_lote === loteo.id_lote);

     
    //Inner join de socio con indo de Lote
    let resultado = sociosFilters.map(socio => {
        const nombreInfo = socios.find(nombre => nombre.id_socio === socio.id_socio);
        return { ...socio, ...nombreInfo };
    });


    //Obtiene el departamento al que corresponde
    let depto = departamentos.find(objeto => objeto.id_depto === loteo.id_depto)
        

    /* console.log(sociosFilters)
    console.log(resultado)
    console.log(depto) */
        
    let card_lote = document.createElement('div')
    card_lote.setAttribute('class',"border rounded-xl flex p-4 gap-x-4 shadow-lg cursor-pointer bg-slate-100 hover:bg-slate-200")
    //console.log(lote)
    card_lote.setAttribute('id','loteo'+loteo.id_lote)

    card_lote.innerHTML = `
        <div class="flex flex-col">

            <!--Info-->               
            <h2 class="uppercase tracking-wide text-black leading-tight font-semibold text-lg">${depto.nombre}</h2>
            <p class="tracking-wide">${loteo.direccion}</p>                                                     
            
            <!-- Nombre del Loteo -->
            <div class="flex flex-grow items-center justify-center p-4">
                <p class="uppercase font-semibold text-red-600 text-md tracking-wide text-xl">${loteo.nombre}</p>
            </div>

            <!-- Lotes -->
            <div class="flex">
            <div class="flex items-center justify-between w-full gap-x-8">
                <p class="text-slate-500 font-semibold text-lg">Lotes</p>               
                <div class="flex gap-x-4">
                    <p class="border rounded p-1"> <span class="text-sm font-semibold"> Total: </span> ${loteo.cant_terrenos} </p>
                    <p class="border rounded p-1"> <span class="text-sm font-semibold"> Vendidos: </span> ${loteo.vendidos} </p>
                    <p class="border rounded p-1"> <span class="text-sm font-semibold"> Disponibles: </span> ${loteo.disponibles} </p>
                    </div>
                </div>
            </div>

        </div>


        <!-- Linea divisora -->
        <hr class="h-auto border border-white border-1">

        <!--Socios-->
        <div class="flex flex-col gap-y-1">
            <p class="text-slate-500 font-semibold text-center ">Socio/s</p>         
            ${ 
                resultado.map( socio => {
                 return createSocioHTML(socio)
                }).join('')
             
             }
        </div> 
    `

    card_lote.addEventListener('click',()=> getTerrenos(loteo.id_lote));

    return card_lote;        
     

    
}


function createSocioHTML(socio){

    //console.log(socio)

    if(!socio.hasOwnProperty('nombre'))
        return ``
    
       
    return `
        <div class="flex items-center border rounded p-1 justify-between">
            <i class="flex items-center mr-1 text-black"><span class="material-icons-round">person</span></i>
            <!-- Mostraría la información del socio-->
            <a class="text-sm"> ${socio.nombre} ${socio.apellido} </a>
            <p class="ml-4">${socio.porcentaje} %</p>  
        </div>
    `
}




//ESTO DEBERÍA IR EN EL ARCHIVO DE TERRENOS PARA FACILITAR LA LECTURA
/*********************************************************************/

async function getTerrenos(id_lote){

    //Limpiamos la interface de Loteo
    let dashboard = document.querySelector("#body-dashboard")
    dashboard.innerHTML = ""

    //Muestra spinner
    spinner.classList.remove("hidden")  
  
    let response;
    try {
        response = await gapi.client.sheets.spreadsheets.values.batchGet({
            spreadsheetId: '1oWd2Nr4qCsJ9sSMrUcEIenZ_0pphDMREbVbVlUx6Ph8',
            ranges: ['Terrenos!A:M', 'Terrenos!O:U', 'Terrenos!W:X', 'Terrenos!Y:Z']
        });


    } catch (err) {
        console.error(err)
        //document.getElementById('content').innerText = err.message;
        return;
    }

    //Evalua la longitud de la response
    const range = response.result.valueRanges;
    if (range.length == 0) {
        console.warn("No se encontraron valores")
        return;
    } 

    // Muestra por pantalla
    //console.log(response.result.valueRanges)

    terrenos = convertToObjects(range[0].values)
    clientes = convertToObjects(range[1].values)
    tipo = convertToObjects(range[2].values)
    estado = convertToObjects(range[3].values)

    //Terrenos filtrados
    let terrenosFiltrados = terrenos.filter(terreno => terreno.id_lote == id_lote);
    //console.log(terrenosFiltrados)

    //Terrenos Frentistas
    let frentistas = terrenosFiltrados.filter(terreno => terreno.tipo === '2')
    //console.log(frentistas)

    //Terrenos Internos
    let internos = terrenosFiltrados.filter(terreno => terreno.tipo === '1')
    //console.log(internos)
   
    mostrarTerrenos(frentistas, internos, clientes);
    
    //Oculta spinner
    spinner.classList.add("hidden")     

}


function mostrarTerrenos(frentistas, internos, clientes){

    //console.log(frentistas, internos, clientes)

    //CREA LA SECTION
    let section = document.createElement("section")
    section.setAttribute("class", "px-8 mt-4")

    //CREA EL TITLE GENERAL
    let title = document.createElement("p")
    title.setAttribute("class", "uppercase text-red-600 font-semibold mb-8")
    title.innerText = "Altos de Carmelo"

    //CREA SUBTITLES
    let subtitle1 = document.createElement("p")
    subtitle1.setAttribute("class", "uppercase text-gray-500 font-semibold mb-2 pb-1 border-b-2 border-gray-300")
    subtitle1.innerText = "Lotes internos"

    let subtitle2 = document.createElement("p")
    subtitle2.setAttribute("class", "uppercase text-gray-500 font-semibold mb-2 pb-1 border-b-2 border-gray-300 mt-12")
    subtitle2.innerText = "Lotes frentistas"


    //CREA LA SECCION PARA LOS TERRENOS INTERNOS
    let sectionInternos = document.createElement("div")
    sectionInternos.setAttribute("class", "flex flex-wrap justify-between gap-x-4 gap-y-4")

    internos.forEach(terreno => {
        let card_terreno = createCardTerreno(terreno, clientes)

        sectionInternos.appendChild(card_terreno)
    });


    //CREA LA SECCION PARA LOS TERRENOS FRENTISTAS
    let sectionFrentistas = document.createElement("div")
    sectionFrentistas.setAttribute("class", "flex flex-wrap justify-between gap-x-4 gap-y-4")

    frentistas.forEach(terreno => {
        let card_terreno = createCardTerreno(terreno, clientes)

        sectionFrentistas.appendChild(card_terreno)
    });


    //AÑADIMOS COMO HIJO

    section.appendChild(title)
    section.appendChild(subtitle1)
    section.appendChild(sectionInternos)
    section.appendChild(subtitle2)
    section.appendChild(sectionFrentistas)

    container.appendChild(section)


}


function createCardTerreno(terreno, clientes){
    
    //CREA LA CARD PARA EL TERRENO
    let card_terreno = document.createElement("div")
    card_terreno.setAttribute("class", "w-1/5 border bg-white shadow-md p-4 rounded-md hover:bg-slate-100")

    card_terreno.innerHTML = `
        <div class="flex justify-between items-center mb-4">
            <p class="uppercase tracking-wide font-semibold">${terreno.nro}</p>
            <a href="#" class="text-sm text-blue-600">Ver plano</a>
        </div>
        <div class="flex flex-col gap-y-2">
            <p class="text-sm text-slate-500 tracking-wide leading-tight font-semibold">Valor de venta: ${terreno.valor_de_venta}</p>
            <p class="text-sm ${(terreno.id_cliente === 'NULL')?'text-green-600': 'text-black'} tracking-wide leading-tight font-semibold">${(terreno.id_cliente === 'NULL')?'Disponible': getCliente(terreno.id_cliente, clientes)}</p>
        </div>
    `

    return card_terreno;

}


function getCliente(id_cliente, clientes){
    let cli = clientes.find(objeto => objeto.id_cliente == id_cliente);
    //console.log(cli, clientes)
    return `${cli.nombre.charAt(0).toUpperCase() + cli.nombre.slice(1)} ${cli.apellido.charAt(0).toUpperCase() + cli.apellido.slice(1)}`
}
