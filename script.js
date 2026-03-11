const formulario = document.getElementById("cepForm");
const resultado = document.getElementById("resultado");

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const cep = document.getElementById("cep").value.replace(/\D/g, "");

    if (cep.length != 8) {
        alert("Por favor, digite um CEP com oito dígitos");
        return;
    }

    resultado.innerHTML = "Buscando...";

    try {
        const endereco = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const dados = await endereco.json();

        if (dados.erro) {
            resultado.innerHTML = "CEP inválido";
        } else {
            resultado.innerHTML = "Rua: " + dados.logradouro + "<br>" + "Bairro: " + dados.bairro + "<br>" + "Cidade: " + dados.localidade + "-" + dados.uf;

            const cidade = dados.localidade;

            const dadosGeo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidade)}&count=1&language=pt&format=json&countryCode=BR`);
            const dadosGeoJson = await dadosGeo.json();

            console.log(dadosGeoJson);

            if (dadosGeoJson.results && dadosGeoJson.results.length > 0) {
                const { latitude, longitude } = dadosGeoJson.results[0];
                //console.log(latitude);
                //console.log(longitude);
                const clima = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
                const climaJson = await clima.json();
            } else {
                console.log("Não entrou. ");
            }
        }

    } catch (error) {
        resultado.innerHTML = "Erro ao consultar o CEP";
    }
});
