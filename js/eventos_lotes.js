//***************************  EVENTOS  *******************/
let button_add_loteo = document.querySelector("#add-loteo")
button_add_loteo.addEventListener('click', addLoteo)

function addLoteo(){
    console.log("BUTTON AÑADIR LOTEO")
}


let button_update_loteos = document.querySelector("#update-loteos")
button_update_loteos.addEventListener('click', updateLoteos)

function updateLoteos(){
    console.log("BUTTON updat LOTEOS")
}


let select_depto = document.querySelector("#departamentos")
select_depto.addEventListener('change', filtrarLoteos)


let search_loteo_nombre = document.querySelector("#search-loteo-nombre")
search_loteo_nombre.addEventListener('input', filtrarLoteos)


let search_loteo_socio = document.querySelector("#search-loteo-socio")
search_loteo_socio.addEventListener('input', filtrarLoteos)



function filtrarLoteos(){

   //Capturo id del departamento selecionado
   let id_departamento = document.querySelector("#departamentos").value 

   //console.log( "id", id_departamento)
   //console.log( "aa", search_loteo_nombre.value)
   //console.log( "bb",search_loteo_socio.value)

    if(id_departamento === '0'){
        if(search_loteo_nombre.value === ''){
            if(search_loteo_socio.value === ''){
                //No se ha aplicado nigun filtro
                mostrarLotes(loteos, porcentajes, socios, departamentos)
                
            }else{
                //Filtramos por nombre de socio
                let sociosFilters = socios.filter(objeto => objeto.nombre.includes(search_loteo_socio.value));
                console.log(sociosFilters)

                //Obtiene los IDs de los socios
                let idsSocios = sociosFilters.map(socio => socio.id_socio);

                //Obtinene los IDs de lotes a traves de la entidad de relacion
                let porcentajesFiltrados = porcentajes.filter(porcentaje => idsSocios.includes(porcentaje.id_socio));

                //Obtiene los id de los lotes en funcion a los socios buscados
                const idsLotesFiltrados = porcentajesFiltrados.map(porcentaje => porcentaje.id_lote);

                //Filtra los lotes por los id encontraods
                const lotesFiltrados = loteos.filter(loteo => idsLotesFiltrados.includes(loteo.id_lote));

                //SI MANDO SOCIOS FILTERS -> Solo me muestra el socio filtrado en las tarjetas
                mostrarLotes(lotesFiltrados, porcentajes, socios /*sociosFilter*/ , departamentos)

            }
        }
    }

}

