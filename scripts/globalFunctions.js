const enviar_whatsapp = async (numero, notificacion) => {
    btnEnviar.classList.add('hide')
    progressBar.classList.remove('hide')
    let url = "http://localhost:3000/API/Send";
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.responseText);
            progressBar.classList.add('hide')
        }
    };

    let data = `{
      "number": "521${numero}",
      "message": "${notificacion.replace(/\n/g, '--')}"
    }`;

    xhr.send(data);
}