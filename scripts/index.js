import { getFirestore, doc, getDoc, collection, getDocs, addDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";

const db = getFirestore();
const correo = localStorage.getItem('correo');
let currentlist = ''

document.addEventListener('DOMContentLoaded', async function () {
    M.AutoInit();
    await llenar_options_con_listas();
    console.log(messageForm['lista'].value)
    messageForm['lista'].value ? crear_tabla_de_lista(messageForm['lista'].value) : M.toast({html: 'No hay ninguna lista, crea una para empezar'});
    progressBar.classList.add('hide')
});

messageForm.addEventListener('submit', async (e) => {
    mensajesEnviados = 0;
    btnEnviar.classList.add('hide')
    progressBar.classList.remove('hide')
    e.preventDefault();
    let mensaje = messageForm['message'].value;
    let lista = messageForm['lista'].value;
    let media = mediaLabel.innerHTML != '' ? mediaLabel.innerHTML : null;
    let numeroAux = 0
    console.log(lista, mensaje);
    const querySnapshot = await getDocs(collection(db, `usuarios/${correo}/listas/${lista}/numeros`));
    querySnapshot.forEach((doc) => {
        numeroAux += 1;
        // doc.data() is never undefined for query doc snapshots
        let numero = doc.data().numero
        setTimeout(()=>{
            enviar_whatsapp(numero, mensaje, media)
        }, 5000*numeroAux)
    });
    setTimeout(()=>{
        btnEnviar.classList.remove('hide')
        progressBar.classList.add('hide')
        M.toast({html: 'Ya puedes enviar otro mensaje'})
    }, 5000*numeroAux)
})

messageForm['lista'].addEventListener('change', (e) => {
    console.log(messageForm['lista'].value)
    crear_tabla_de_lista(messageForm['lista'].value)
})

messageForm['archivo'].addEventListener('change', (e) => {
    let nombreArchivo = e.target.files[0].name;
    mediaLabel.innerHTML = `./archivos/${nombreArchivo}`

})

btnNuevaLista.addEventListener('click', () => {
    console.log('Agregar')
    let nombreLista = prompt("Escribe el nombre de la nueva lista")
    nombreLista ? crear_lista_en_db(nombreLista) : console.log('Se cancel?? la creaci??n de la nueva lista');
})

btnBorrarLista.addEventListener('click', () => {
    let confirmacion = confirm('Est??s seguro que deseas borrar la lista actual')
    confirmacion ? borrar_lista_actual() : console.log('Se cancel?? la eliminaci??n de la lista');
})

btnNuevoNumero.addEventListener('click', () => {
    let nombre = prompt("Nombre:")
    let numero = prompt("N??mero:")
    numero ? crear_nuevo_numero_en_lista_actual(nombre, numero) : M.toast({html: 'El n??mero no puede estar vacio'});
})

tabla.addEventListener('click', (e) => {
    console.log(e.target.closest('button'))
    let currentButton = e.target.closest('button') != null ? e.target.closest('button').dataset.id : false;
    currentButton ? borrar_numero(currentButton) : '';
})

const llenar_options_con_listas = async () => {
    const querySnapshot = await getDocs(collection(db, `usuarios/${correo}/listas`));
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        let option = document.createElement('option');
        option.value = doc.id;
        option.text = doc.data().nombre;
        messageForm['lista'].appendChild(option);
    });
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems, {});
}

const crear_tabla_de_lista = async (lista) => {
    cantidadNumeros = 0;
    currentlist = lista;
    tabla.innerHTML = '';
    let clientes = [];
    const usuarios = await getDocs(collection(db, (`usuarios/${correo}/listas/${lista}/numeros`)));
    console.log(usuarios)
    usuarios.forEach(async (e) => {
        cantidadNumeros += 1;
        let cliente = [];
        let button = document.createElement('button')
        button.dataset.id = e.id
        button.classList.add('btn')
        button.classList.add('red')
        button.classList.add('waves-effect')
        button.innerHTML = `<i class="material-icons">delete</i>`
        console.log(e.data())
        cliente.push(button)
        cliente.push(e.data().nombre)
        cliente.push(e.data().numero.replace(/[ ()-]/g, ''))
        clientes.push(cliente)
    })
    let grid = new gridjs.Grid({
        columns: ["Editar", "Nombre", "WhatsApp"],
        data: clientes,
        sort: true,
        search: {
            enabled: true
        },
        pagination: {
            enabled: true,
            limit: 10
        },
        className: {
            pagination: 'card-container pagination center',
            paginationButton: 'waves-effect blue btn-floating',
            paginationButtonCurrent: 'transparent black-text btn-floating',
            paginationButtonNext: 'darken-4',
            paginationButtonPrev: 'darken-4'
        },
        language: {
            'search': {
                'placeholder': 'Buscar...'
            },
            'pagination': {
                'previous': '<',
                'next': '>',
                'showing': 'Mostrando',
                'to': 'al',
                'of': 'de',
                'results': () => 'clientes'
            },
            noRecordsFound: 'No hay n??meros en esta lista',
        }
    }).render(document.getElementById("tabla"));
    grid.forceRender()
    console.log(grid.config)
    progressBar.classList.add('hide');
}

const crear_lista_en_db = async (nombre) => {
    const docRef = await addDoc(collection(db, `usuarios/${correo}/listas`), {
        nombre
    });
    console.log("ID de la nueva lista: ", docRef.id);
    let option = document.createElement('option');
    option.value = docRef.id;
    option.text = nombre;
    messageForm['lista'].appendChild(option);
    messageForm['lista'].value = docRef.id;
    crear_tabla_de_lista(messageForm['lista'].value)
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems, {});
}

const crear_nuevo_numero_en_lista_actual = async (nombre, numero) => {
    const docRef = await addDoc(collection(db, `usuarios/${correo}/listas/${currentlist}/numeros`), {
        nombre,
        numero
    });
    console.log("ID de la nueva lista: ", docRef.id);
    crear_tabla_de_lista(messageForm['lista'].value)
}

const borrar_lista_actual = async () => {
    await deleteDoc(doc(db, `usuarios/${correo}/listas`, currentlist));
    location.reload();
}

const borrar_numero = async (id) => {
    await deleteDoc(doc(db, `usuarios/${correo}/listas/${currentlist}/numeros`, id));
    crear_tabla_de_lista(messageForm['lista'].value)
}