let mensajesEnviados = 0;
let cantidadNumeros = 0;

const enviar_whatsapp = async (numero, notificacion, media) => {
    mensajesEnviados += 1;
    M.toast({html: `${mensajesEnviados}/${cantidadNumeros} - Enviando mensaje a ${numero}`})
    let url = "http://localhost:3000/whatsapp/";
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.responseText);
            M.toast({html: `${mensajesEnviados}/${cantidadNumeros} - ${numero} ${xhr.responseText}`})
        }
    };
    media = media ? `,"media": "${media}"` : '';
    numero = numero.indexOf('00') == 0 ? `${numero.slice(2)}` : `521${numero}`;
    console.log(numero)
    let data = `{
      "number": "${numero.replace(/[ ()-]/g, '')}",
      "message": "${notificacion.replace(/\n/g, '--').replace(/['"]+/g, '_')}"
      ${media}
    }`;

    xhr.send(data);
}