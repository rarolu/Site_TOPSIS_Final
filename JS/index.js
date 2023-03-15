 
let i = 0
let j = 0
let k = 0
let storage = window.localStorage;


function tirarInputCriterio() {
    if (i > 0) {
        $("#criterios" + i).remove()
        i--
    }

}

function tirarInputDecisores() {

    if (k > 0) {
        $("#decisores" + k).remove()
        k--
    }
}

function tirarInputAlternativas() {

    if (j > 0) {
        $("#alternativas" + j).remove()
        j--
    }
}

function adicionarInputDecisores() {

    
    if(k <= 13 ){
        k++
        
        let newInput = $("#decisores0").clone()
        newInput.attr('id', 'decisores' + k);
        newInput.attr('name', 'decisor' + k);
        newInput.val("")
        newInput.appendTo("#form_decisores")
        // $( "#form_decisores" ).append("<br><br>")
    }

    
    

}

function adicionarInputCriterio() {

    
    if(i <= 13 ){
    
    i++
        
    let newInput = $("#criterios0").clone()
    newInput.attr('id', 'criterios' + i);
    newInput.attr('name', 'criterio' + i);
    newInput.val("")
    newInput.appendTo("#form_criterios")// passa como parametro o nome com o valor de 'i'
    // $( "#form_criterios" ).append("<br class='linha'><br class='linha><br class='linha>")


    // document.title === 'Form2'
    }
}

function adicionarInputAlternativas() {

    
    if(j <= 13 ){
        
    j++
    
    let newInput = $("#alternativas0").clone()
    newInput.attr('id', 'alternativas' + j);
    newInput.attr('name', 'alternativa' + j);
    newInput.val("")
    newInput.appendTo("#form_alternativas")// passa como parametro o nome com o valor de 'i'

    // $( "#form_alternativas" ).append("<br><br>")

    }
}


function AddDecisores(){

    var metodo =storage.getItem('opt_metodo1')

    console.log(metodo)

    if(metodo === "SAPEVO")
    {
        $('#div_decisores').append(`
        <h2>Decisores</h2>
        <form  style="padding-bottom:10px" id="form_decisores" action="#">
            <input type="text" class="input" name="decisor0" id="decisores0" placeholder="Digite o nome do Decisor">
            </form>
            <button  class="btn btn-success" id="add_decisores" onclick="adicionarInputDecisores()">+ Decisor</button>
            <button style="margin-top: 10px;" class="btn btn-danger" id="remove_decisores" onclick="tirarInputDecisores()">- Decisor</button>

            
        `)
    }
    else{
        
        document.getElementById('div_decisores').style="display:none"
    }


}

function ObterMatris() {
    // ====================== obtendo a matrix =====================    
    ponderando = 0
    arrayMatris = []
    arrayC = GetArrayCriterios()
    arrayA = GetarrayAlternativas()



    datas = JSON.parse(storage.getItem('objeto'))
    //console.log(datas)
    //console.log(arrayA)

    for (var i = 0; i < arrayC.length; i++) {

        arrayMatrisX = []

        for (var j = 0; j < arrayA.length; j++) {
            valor = datas[i][j].value
            arrayMatrisX.push(valor)
            console.log(arrayMatrisX)

        }
        arrayMatris.push(arrayMatrisX)

        console.log('alou')
    }
    return arrayMatris

}

function TOPSIS_MaxMIn() {


    let S_ideal = []
    let S_n_ideal = []
    let arrayC = GetArrayCriterios()
    let calc_ideal = 0
    let calc_n_ideal = 0
    let array_calc_ideal = []
    let array_calc_n_ideal = []
    let arrayPR = []
    let Proxi_rel = 0
    arrayA = GetarrayAlternativas()
    arrayC = GetArrayCriterios()



    if(storage.getItem("opt_metodo2") == "TOPSIS")
    {
        matris = TOPSIS_MatrisPonderamento()
    }
    if(storage.getItem("opt_metodo2") == "TOPSIS-2N"){

        matris = TOPSIS_2N_MatrisPonderamento ()

    }
    if(storage.getItem("opt_metodo2") == "TOPSIS-2NE"){
        matris = TOPSIS_2N_MatrisPonderamento ()

        
    }








    for (let i = 0; i < arrayC.length; i++) {

        let MinMax = storage.getItem('MinMax_' + i)
        

        if (MinMax === 'Max') {

            S_ideal.push(Math.max.apply(Math, matris[i]))
            S_n_ideal.push(Math.min.apply(Math, matris[i]))
        }
        if (MinMax === 'Min') {
            S_ideal.push(Math.min.apply(Math, matris[i]))
            S_n_ideal.push(Math.max.apply(Math, matris[i]))
        }
        console.log(S_ideal)
        console.log(S_n_ideal)


    }

    // console.log(S_ideal)
    // console.log(S_n_ideal)


    for (let i = 0; i < arrayA.length; i++) {
        calc_ideal = 0
        calc_n_ideal = 0

        for (let j = 0; j < arrayC.length; j++) {
            calc_ideal = calc_ideal + ((matris[j][i] - S_ideal[j]) * (matris[j][i] - S_ideal[j]))

            calc_n_ideal = calc_n_ideal + ((matris[j][i] - S_n_ideal[j]) * (matris[j][i] - S_n_ideal[j]))
            console.log(calc_ideal)

        }
        calc_n_ideal = Math.sqrt(calc_n_ideal)
        calc_ideal = Math.sqrt(calc_ideal)

        console.log(calc_ideal)
        console.log(calc_n_ideal)

        array_calc_ideal.push(calc_ideal)
        array_calc_n_ideal.push(calc_n_ideal)
        Proxi_rel = array_calc_n_ideal[i] / (array_calc_ideal[i] + array_calc_n_ideal[i])

        arrayPR.push(Proxi_rel)



    }

    return [array_calc_ideal, array_calc_n_ideal, arrayPR]

}




function testeMAXmin(){

   const matrizPonderamento = TOPSIS_MatrisPonderamento()
    i = 0; // Rows
    j = 0; // Columns
    let a = 0; // iterations
    let attributeValues = [];
    const idealSolution = [];
    const aidealSolution = [];
    let attributeFunction = null;
    const arrayMaxMin = []

    for (let k = 0; k < arrayC.length; k++) {

        let MinMax = storage.getItem('MinMax_' + k)
        arrayMaxMin.push(MinMax)
    }
  
    for (a = 0; a < 2; a += 1) {
      for (j = 0; j < matrizPonderamento[1].length; j += 1) {
        for (i = 0; i < matrizPonderamento.length; i += 1) {
          attributeValues.push(matrizPonderamento[i][j]);
        }
  
        if (a === 0) {
          if (arrayMaxMin[j] === 'Min') {
            attributeFunction = Math.min(...attributeValues);
            idealSolution.push(attributeFunction);
          } else if (arrayMaxMin[j] === 'Max') {
            attributeFunction = Math.max(...attributeValues);
            idealSolution.push(attributeFunction);
          }
        } else if (a === 1) {
          if (arrayMaxMin[j] === 'Min') {
            attributeFunction = Math.max(...attributeValues);
            aidealSolution.push(attributeFunction);
          } else if (arrayMaxMin[j] === 'Max') {
            attributeFunction = Math.min(...attributeValues);
            aidealSolution.push(attributeFunction);
          }
        }
  
        attributeValues = [];
      }
      j = 0;
      console.log(aidealSolution)
      console.log(idealSolution)
    }
    
}





function squareSUMarray(array) {
    let sum = 0
    for (let i = 0; i < array.length; i++) {
        sum += (array[i] * array[i])

    }
    return Math.sqrt(sum)
}

function home() {

    window.location.href = '../index.html'

    localStorage.clear()

}

function valorRadio() {

    // pega o valor do radio button
    

    var choices = [];
    var method = document.getElementsByName('metodo1');

    let NomeAnalise = document.getElementById('analise_nome').value

    storage.setItem('Nome_analise', NomeAnalise)




    for (var i = 0; i < method.length; i++) {

        if (method[i].checked) {
            choices.push(method[i].value);


            storage.setItem('opt_metodo1', method[i].value)

            console.log(storage.getItem('opt_metodo1'))

        }

    }


    var choices2 = [];
    var els = document.getElementsByName('metodo2');
    for (var i = 0; i < els.length; i++) {

        if (els[i].checked) {
            choices.push(els[i].value);
            storage.setItem('opt_metodo2', els[i].value)

            console.log(storage.getItem('opt_metodo2'))

        }

    }



    //window.location.href ='http://google.com'

    // $(location).attr('href', 'http://google.com');

}

function chamarPagina() {


    // chamar pagina clicando no botão proximo selecionando os metodos 

    var a = storage.getItem('opt_metodo1')

    console.log(typeof (a))

    console.log(a)

    b = "AHP"

    JSON.stringify(b)

    console.log(typeof (b))
    console.log(b)

    console.log(a == b)

    var option1 = document.getElementsByName('metodo1');
    var option2 = document.getElementsByName('metodo2');


    if (!(option1[0].checked || option1[1].checked || option1[2].checked)) {
        alert("Por Favor Selecione o método para obtenção dos pesos");
        // return false;
    } else if (!(option2[0].checked || option2[1].checked || option2[2].checked)) {
        alert("Por Favor Selecione o Método para Ranqueamento");
    } else  if (document.getElementById("analise_nome").value == "") {
        alert("Por favor, digite um nome para a análise");

    } else  {

        window.location.href = './HTML/registroAltCrit.html'
    }

}




function salvarAlternativa() {

    let validation = true
    let strAlt = $("#form_alternativas").serializeArray(); // transforma  os inputs em objeto
    console.log(strAlt)


    for (const alternativa of strAlt) {  // atribui para cada valor do objeto strAlt  uma key(alternativa.name) e um valor(alternativa.value)

        storage.setItem(alternativa.name, alternativa.value)
        console.log(alternativa)

        if (!alternativa.value) {
            alert('preencha todos os campos das alternartivas')
            validation = false
            break;
        }


    }
    console.log('erro', validation)
    if (validation) {
        storage.setItem("kqtalternativa", strAlt.length) // adiciona aquantidade de inputs    
        // if (storage.getItem('opt_metodo1') == "AD") {
        //     window.location.href = './valoresCriterios.html'
        // }
        // else{
        //     window.location.href = './Prioridade.html'
        // }
    }
}

/*for (let i = 0; i <= 6; i++) {
    if ($("#alternativas"+i).val() !== "" && count === false){
        console.log('hello')
        storage.setItem("kqtalternativa", i)
        // window.location.href = './valoresCriterios.html'
        count = true;
        
        
    }else{
        alert('alerta'+i)
        count = true
        break;  }
    }

}*/

function salvarCriterio() {


    let validation = true

    let strCrit = $("#form_criterios").serializeArray(); // transforma  os inputs em objeto
    console.log(strCrit)


    for (const criterio of strCrit) {  // atribui para cada valor do objeto  uma key(numero.name) e um valor(numero.value)
        storage.setItem(criterio.name, criterio.value)

        console.log(criterio.name)

        if (!criterio.value) {

            // n = criterio.name
            alert('preencha todos os campos dos criterios')
            // document.getElementById('criterios0').className += "invalid";
            validation = false
            break;
        }


    }
    if (validation) {
        storage.setItem("kqtcriterio", strCrit.length) // adiciona aquantidade de inputs    
 
    }
}

function SalvarDecisor(){

    let validation = true

    let strDec = $("#form_decisores").serializeArray(); // transforma  os inputs em objeto
    console.log(strDec)

    
    for (const decisores of strDec) {  // atribui para cada valor do objeto  uma key(numero.name) e um valor(numero.value)
        storage.setItem(decisores.name, decisores.value)
        
        console.log(decisores)
        
        if (!decisores.value) {
            alert('preencha todos os campos dos decisoress')
            validation = false
            break;
        }
        
    }
    if (validation) {
        storage.setItem("kqtDecisores", strDec.length) // adiciona aquantidade de inputs    


    }
}



function SalvarDADOS(){

    let nextC = true
    let nextA = true
    let nextD = true
    let confirm = true

    let validation = true

    if(confirm == true){

        let strDec = $("#form_decisores").serializeArray(); // transforma  os inputs em objeto
        console.log(strDec)
    
        
        for (const decisores of strDec) {  // atribui para cada valor do objeto  uma key(numero.name) e um valor(numero.value)
            storage.setItem(decisores.name, decisores.value)
            
            console.log(decisores)
            
            if (!decisores.value) {
                alert('preencha todos os campos dos decisoress')
                validation = false
                break;
            }
            
        }
        if (validation) {
            storage.setItem("kqtDecisores", strDec.length) // adiciona aquantidade de inputs    
            nextD = false
    
    
        }
    
    
    
    
    
    
    
        let strCrit = $("#form_criterios").serializeArray(); // transforma  os inputs em objeto
        console.log(strCrit)
    
    
        for (const criterio of strCrit) {  // atribui para cada valor do objeto  uma key(numero.name) e um valor(numero.value)
            storage.setItem(criterio.name, criterio.value)
    
            console.log(criterio)
    
            if (!criterio.value) {
                alert('preencha todos os campos dos criterios')
                validation = false
                break;z
            }else if(strCrit.length < 2){
                alert('A quantidade de Critérios tem que ser maior que 1')
                validation = false
                break;

            }
    
    
        }
        if (validation) {
            nextC = false
            storage.setItem("kqtcriterio", strCrit.length) // adiciona aquantidade de inputs    
     
        }
    
    
    
    
    
    
    
    
    
    
        let strAlt = $("#form_alternativas").serializeArray(); // transforma  os inputs em objeto
        console.log(strAlt)
    
    
        for (const alternativa of strAlt) {  // atribui para cada valor do objeto strAlt  uma key(alternativa.name) e um valor(alternativa.value)
    
            storage.setItem(alternativa.name, alternativa.value)
            console.log(alternativa)
            console.log(strAlt.length)
    
            if (!alternativa.value) {
                alert('preencha todos os campos das alternartivas')
                validation = false
                break;
            }else if(strAlt.length < 2){
                alert('A quantidade de Alternartivas tem que ser maior que 1')
                validation = false
                break;

            }
    
    
        }
        console.log('erro', validation)
        if (validation) {
            storage.setItem("kqtalternativa", strAlt.length) // adiciona aquantidade de inputs    
    
            nextA = false
    
            // if (storage.getItem('opt_metodo1') == "AD") {
            //     window.location.href = './valoresCriterios.html'
            // }
            // else{
            //     window.location.href = './Prioridade.html'
            // }
        }


    }

    if(nextA == false && nextC == false && nextD == false)
    {
        confirm = false
    }else{
        confirm = true
    }
    
    
    return confirm;



}




















function resultado() {

    let totalSumIput = 0
    qtdinput = Number(storage.getItem("kqtdinput"))

    numero02 = Number(storage.getItem("knumero2"))

    for (let i = 0; i < qtdinput; i++) { //  soma dos valores de cada input pegando suas keys como valor
        totalSumIput += Number(storage.getItem("numero" + i))
    }


    totalsum = totalSumIput + numero02

    console.log(totalsum)

    $('#resultado').html(totalsum)
}




function valoresCriterios() {

    // ================================coloca os valores dos nomes do inputs do storage no arrary==============================

    arrayC = GetArrayCriterios()
    arrayA = GetarrayAlternativas()
    arrayD = GetArrayDecisor()

    // =========================adiciona as alternativas para cada criterio nas <divs> e cada valor se quer maximizar ou minimizar ====================================================================
    for (let i = 0; i < arrayC.length; i++) {

        $('#div_CriAlt').append('<div style=" margin-bottom: 30px;text-align: center;width: 70%;background: gainsboro;padding-bottom: 30px;border: 3px solid #000;padding-top: 10px;box-shadow: 10px 10px 10px;"><h2 style="padding: 10px 0 40px 0;text-decoration: underline;">Critério : ' + arrayC[i] + '</h2><div style="font-style: italic;font-size: xx-large;font-weight: bolder; padding-bottom: 20px;" id="div_peso' + i + '" class="div_pesos" > Peso  <input  min="0" onfocus="this.previousValue = this.value" onkeydown="this.previousValue = this.value" oninput="validity.valid || (value = this.previousValue)" name="numero" type="number" id="Peso' + i + '" step="any" class="pesos">  </input> </div>  <div  style="TEXT-ALIGN: right;display: inline-table; "id="div' + i + '"><form id="form' + i + '"></form><select name="SLCT' + i + '" id="SLCT' + i + '" required="" style="width: 150px; margin-top: 5px;"><option value="Max">Maximizar ↑</option><option value="Min">Minimizar ↓</option></select></div></div> ')

        if (!(storage.getItem('opt_metodo1') === "AD")) {
            document.getElementById("div_peso" + i).remove()
        }


        for (let j = 0; j < arrayA.length; j++) {

            $('#form' + i).append('<label>' + arrayA[j] +' &nbsp ' +' </label><input  class="Valores_Alternativas"  step="0.0001" name="numero" type="number" name=' + arrayA[j] + ' style="width: 150px; margin-top: 5px;"><br>')


        }

    }

    var invalidChars = [ "e", "+", "E"];

    $("input[type='number']").on("keydown", function(e){ 
        if(invalidChars.includes(e.key)){
             e.preventDefault();
        }
    })

}



function GerarObjeto() {

    // ================================coloca os valores dos nomes do inputs do storage no arrary==============================

    let arrayObjeto = []
    arrayC = GetArrayCriterios()
    arrayA = GetarrayAlternativas()
    let arrayPeso = []
    Psapevo = PesosSAPEVO()


    // ===========================================transforma os inputs em objetos =============================================


    for (let i = 0; i < arrayC.length; i++) {
        let srl = $("#form" + i + "").serializeArray(); // transforma  os inputs em objeto
        arrayObjeto.push(srl)

        // ============= adicona o valor de Min / Max ================
        valor = $('#SLCT' + i).val();
        console.log(valor)
        storage.setItem("MinMax_" + i, valor)

    }
    storage.setItem('objeto', JSON.stringify(arrayObjeto))
    console.log(storage.getItem('objeto'))

}

function GerarPeso(){



    AHPpeso = PesosAHP()
    pesoValor = 0


    var somaPeso = 0
    if (storage.getItem('opt_metodo1') == "SAPEVO") {
        pesoValor = PesosSAPEVO()

        for (let i = 0; i < arrayC.length; i++) {
            storage.setItem('Peso_' + arrayC[i], pesoValor[i])
    
            pesoValorFixed = Number(pesoValor[i].toFixed(2))
    
            somaPeso += pesoValorFixed
    
        }
        if (somaPeso < 1.1) {
    
            // VerificaInput() // função dentro do HTMl valoresCriterios
            window.location.href = './TabelaRanking.html'
        } else {
            alert(' A soma dos pesos tem que ser igual a 1')
            
    
        }    

    }



    if (storage.getItem('opt_metodo1') == "AD") {

        for (let j = 0; j < arrayC.length; j++) {
            pesoValor = Number($("#Peso" + j).val())
            console.log(j)
            storage.setItem('Peso_' + arrayC[j], pesoValor)

            somaPeso += pesoValor

        }
        if (somaPeso == 1) {

            window.location.href = './TabelaRanking.html'
            // VerificaInput() // função dentro do HTMl valoresCriterios
        } else if(somaPeso <= 1.1 || somaPeso >= 1.1){
            alert(' A soma dos pesos tem que ser igual a 1')

        }

    }




    if(storage.getItem('opt_metodo1') == "AHP"){

        pesoValor = PesosAHP()


        for (let i = 0; k < arrayC.length; k++) {
            storage.setItem('Peso_' + arrayC[k], pesoValor[k])

            pesoValorFixed = Number(pesoValor[k].toFixed(2))

            somaPeso += pesoValorFixed

        }
        if (somaPeso < 1.1) {

            window.location.href = './TabelaRanking.html'
            // VerificaInput() // função dentro do HTMl valoresCriterios
        } else {
            alert(' A soma dos pesos tem que ser igual a 1')
            

        }    

    }
}






    // var somaPeso = 0
    // if (storage.getItem('opt_metodo1') == "SAPEVO") {
    //     for (let i = 0; i < arrayC.length; i++) {
    //         pesoValor = Psapevo[i]
    //         storage.setItem('Peso_' + arrayC[i], pesoValor)

    //         somaPeso += pesoValor

    //     }
    //     if (somaPeso < 1) {

    //         window.location.href = './tabela.html'
    //     } else {
    //         alert(' A soma dos pesos tem que ser igual a 1')
            

    //     }

    // }

    





            
            
    //         peso = Number($("#Peso" + i + arrayC[i]).val())

    //         storage.setItem('Peso_' + arrayC[i], peso)

    //         pesoValor = Number(($('#Peso' + i + arrayC[i]).val()))
    //         somaPeso += pesoValor


    //     }
    //     if (somaPeso == 1) {

    //         window.location.href = './tabela.html'
    //     } else {
    //         alert(' A soma dos pesos tem que ser igual a 1')

    //     }
    // } else {
    //     window.location.href = './Prioridade.html'




    // datas = JSON.parse(storage.getItem('objeto'))
    // console.log(datas)
    // console.log(document.querySelector('.pesos').value)

//var cols = ['name', 'value'];

// ===================== criando a tabela =========================================        






function GerarTabela() {

    arrayC = GetArrayCriterios()
    matris = ObterMatris()

    for (var i = 0; i < matris.length; i++) {

        $('table').append('<tr></tr>');
        $('#table_h').append('<th>' + arrayC[i] + '</th>');

        for (var j = 0; j < matris.length; j++) {


            $('table tr:last-child').append('<td>' + (matris[j][i].value) + '</td>');

        }
        $('table tr:last-child').append('<th>' + matris[i][i].name + ' </th>')
    }

}


function GerarPrioridades() {

    arrayC = GetArrayCriterios()
    arrayD = GetArrayDecisor()

    comb = combine(arrayC, 2)
    console.log(comb)

    if(arrayC.length == 2){

        comb = [arrayC]
    }

    if(storage.getItem("opt_metodo1") == "AHP"){
        
        for (const option of comb) {

            console.log(option)
    
            $('#div_prioridade').append('<div id="PRIO"><h2>O quão preferível o critério ' + option[0] + ' é em relação a ' + option[1] + '?  <select name="' + option[0] + '" id="Select_Prior_' + option[0] + '_' + option[1] + '" required="" style="width: 150px; margin-top: 5px;"><option value="0.111" style="background-color: brown ;" >1/9</option><option value="0.125" style="background-color: brown ;" >1/8</option><option value="0.142" style="background-color: brown ;">1/7</option><option value="0.166" style="background-color: brown ;" >1/6</option><option value="0.2" style="background-color: brown ;" >1/5</option><option value="0.25" style="background-color: brown ;" >1/4</option><option value="0.333" style="background-color: brown ;" >1/3</option><option value="0.5" style="background-color: brown ;" >1/2</option><option selected value="1" style="background-color: green ;">1</option><option value="2"  style="background-color: green ;" >2</option><option value="3" style="background-color: green ;" >3</option><option value="4" style="background-color: green ;" >4</option><option value="5" style="background-color: green ;" >5</option><option value="6" style="background-color: green ;" >6</option><option value="7" style="background-color: green ;" >7</option><option value="8" style="background-color: green ;" >8</option><option value="9" style="background-color: green ;" >9</option></select> </h2></div> ')
   

        }

        
    }

    result = combine(arrayC, 2)

    if(storage.getItem("opt_metodo1") == "SAPEVO"){

        for (let j = 0; j< arrayD.length; j++) {
          $('#div_prioridade').append('<h1 style="text-decoration: underline;font-family: monospace;"><br>Decisor:'+arrayD[j]+'<br></h1>')
           
             decisor = arrayD[j]        
          
          for (const [i,option] of result.entries()) {
              
              $('#div_prioridade').append('<div id="PRIO"><h2>O quão preferível o critério ' + option[0] + ' é em relação a ' + option[1] + '?  <select name="' + option[0] + '" id="Select_Prior_'+arrayD[j]+`_` + option[0] + '_' + option[1] + '" required="" style="width: auto; ,width: 150px; margin-top: 5px;"><option  style="background-color: brown;" value="-3">Absolutamente Pior</option><option style="background-color: brown;" value="-2">Muito Pior</option><option  style="background-color: brown;" value="-1">Pior</option><option selected value="0">equivalente</option><option style="background-color: green;" value="1">Melhor</option><option value="2" style="background-color: green;">Muito Melhor</option><option value="3" style="background-color: green;">Absolutamente Melhor </option></select> </h2></div> ')
              
 
            }
        }
    }

}

function GerarValorePrioridades(){

    arrayC = GetArrayCriterios()
    arrayD = GetArrayDecisor()

    let result = combine(arrayC, 2)

    if (storage.getItem("opt_metodo1") == "AHP") {

        for (const option of result) {

            console.log(option)
            select = document.getElementById('Select_Prior_'+ option[0] + '_' + option[1] + '').value
            // select = $('#Select_Prior_' + option[0] + '_' + option[1] + '').val()
            console.log(select)

            storage.setItem('Prio_' + option[0] + '_' + option[1] + '', select)
            storage.setItem('Prio_' + option[1] + '_' + option[0] + '', 1 / select)

        }

    }

    if (storage.getItem("opt_metodo1") == "SAPEVO") {

        for (let j = 0; j < arrayD.length; j++) {


            decisor = arrayD[j]


            for (const [i, option] of result.entries()) {

                select = document.getElementById('Select_Prior_' + arrayD[j] + `_` + option[0] + '_' + option[1] + '').value
                    
                // select = $('#Select_Prior_' + arrayD[j] + `_` + option[0] + '_' + option[1] + '').val()
                console.log(select)

                storage.setItem('Prio_' + decisor + '_' + option[0] + '_' + option[1] + '', select)
                storage.setItem('Prio_' + decisor + '_' + option[1] + '_' + option[0] + '', select * (-1))
            }
        }
    }
}


function PesosSAPEVO(){
    arrayPRIOR = {}
    arrayMatrizPRIOR = []
    valor = 0
    arrayC = GetArrayCriterios()
    arrayA = GetarrayAlternativas()
    arrayD = GetArrayDecisor()
    arrayMatrizOBJ = []
    arrayNormalizaPontSAPEVO = []
    
    
    
    
    for (let h = 0; h < arrayD.length; h++) {
        obj = {
            nome: arrayD[h]
        }
        arrayMatrizPRIOR = []
        ArrayPontuacaoSAPEVO = []
        
        for (let i = 0; i < arrayC.length; i++) {
            arrayPRIOR = []
            somaArray = 0
            for (let j = 0; j < arrayC.length; j++) {
    
                if(i==j){
    
                    arrayPRIOR.push(valor)
    
                }else{
                    
                    prior = Number(storage.getItem(`Prio_`+arrayD[h]+`_`+arrayC[i]+`_`+arrayC[j]))
                    // console.log(prior)
                    arrayPRIOR.push(prior)
                    somaArray = somaArray + prior
                    // console.log(somaArray)
                }
                
                
            }
            arrayMatrizPRIOR.push(arrayPRIOR)
            
            ArrayPontuacaoSAPEVO.push(somaArray)
            console.log(arrayMatrizPRIOR)
            obj.points = ArrayPontuacaoSAPEVO             
        }

        obj.matriz = arrayMatrizPRIOR
        arrayMatrizOBJ.push(obj)
        // console.log(ArrayPontuacaoSAPEVO)

    }
// ===================================================== normalizar Pontuação SAPEVO ==================================


    for (let k = 0; k < arrayD.length; k++) {
        normalizaSAPEVO = 0 
        MaxSap = Math.max.apply(Math, arrayMatrizOBJ[k].points)
        MinSap = Math.min.apply(Math, arrayMatrizOBJ[k].points)
        arrayNM = []

        for (let l = 0; l < arrayC.length; l++) {
            
            normalizaSAPEVO =  ((arrayMatrizOBJ[k].points[l]) - (MinSap)) / (MaxSap  - MinSap)
            arrayNM.push(normalizaSAPEVO)
        }
        arrayNormalizaPontSAPEVO.push(arrayNM)

        
        
    }


    // console.log(arrayNormalizaPontSAPEVO)

    calcCHG = 1

    for (let x = 0; x < arrayD.length; x++) {

        for (let z = 0; z < arrayC.length; z++) {

            
            var valorCHG = arrayNormalizaPontSAPEVO[x][z]
            
            if(valorCHG == 0){
                
                arrayNormalizaPontSAPEVO[x].splice(z ,1)

                any = arrayNormalizaPontSAPEVO[x]
                calcCHG = (Math.min.apply(Math , any) * 0.01)

                // console.log(arrayNormalizaPontSAPEVO[x])

                arrayNormalizaPontSAPEVO[x].splice(z, 0 , calcCHG)
                // console.log(arrayNormalizaPontSAPEVO[x])


     
     
            }
        }


        
    }
    console.log(arrayNormalizaPontSAPEVO)
    
    

 




// ===================================================== Somar normalização Pontuação SAPEVO ==================================
    ArrayPesoNormaSAPEVO = []
    
    for (let m = 0; m < arrayC.length; m++) {
        
        SomaPont = 0
        
        for (let n = 0; n < arrayD.length; n++) {
            
            SomaPont += arrayNormalizaPontSAPEVO[n][m]

        }
        
        ArrayPesoNormaSAPEVO.push(SomaPont)


        
    }

    // console.log(arrayMatrizOBJ)
    // console.log(arrayNormalizaPontSAPEVO)
    console.log(ArrayPesoNormaSAPEVO)

    arrayCalculoPesosSAPEVO = []
    
    for (let o = 0; o < arrayC.length; o++) {

        somaPesosSAPEVO = 0

        for (let p = 0; p < arrayC.length; p++) {

            somaPesosSAPEVO +=  ArrayPesoNormaSAPEVO[p]
            console.log(somaPesosSAPEVO)
            
        }

        CalculoPesos =  ((ArrayPesoNormaSAPEVO[o] * 100) / somaPesosSAPEVO) / 100
        

        arrayCalculoPesosSAPEVO.push(CalculoPesos)
        
    }

    console.log(arrayCalculoPesosSAPEVO)



    return arrayCalculoPesosSAPEVO
}



function PesosAHP() {

    arrayC = GetArrayCriterios()
    arrayA = GetarrayAlternativas()
    arrayD = GetArrayDecisor()
    valorAHP = 1

    arrayMatrizPriorAHP = []
    ArrayPontuacaoAHP = []



    for (let i = 0; i < arrayC.length; i++) {
        arrayPriorAHP = []
        for (let j = 0; j < arrayC.length; j++) {
            
            if (i == j) {
                
                arrayPriorAHP.push(valorAHP)
                
            } else {
                
                prior = Number(storage.getItem(`Prio_` + arrayC[i] + `_` + arrayC[j]))
                // console.log(prior)
                arrayPriorAHP.push(prior)
                // console.log(somaArrayAHP)
            }
            
            
        }
        arrayMatrizPriorAHP.push(arrayPriorAHP)
        
        console.log(arrayMatrizPriorAHP)    
        // obj.points = ArrayPontuacaoAHP             
    }
    
    // obj.matriz = arrayMatrizPriorAHP
    // arrayMatrizOBJ.push(obj)
    
    for (let h = 0; h < arrayC.length; h++) {
        
        somaArrayAHP = 0
        for (let l = 0; l < arrayC.length; l++) {

            arrayMatrizPriorAHP[l][h]
            
            somaArrayAHP = somaArrayAHP + arrayMatrizPriorAHP[l][h]
            
            
        }
        ArrayPontuacaoAHP.push(somaArrayAHP)
        
    }
    
    
    console.log(ArrayPontuacaoAHP)


    arrayMatrizNormaAHP = []

    arrayPesoFinalAHP = []

    for (let m = 0; m < arrayC.length; m++) {

           arrayNormaAHP = [] 
           somaNormaAHP = 0

        for (let n = 0; n < arrayC.length; n++) {

            normaAHP = arrayMatrizPriorAHP[m][n] / ArrayPontuacaoAHP[n]
            arrayNormaAHP.push(normaAHP)
            somaNormaAHP += normaAHP

            
        }

        somaNormaAHP = somaNormaAHP/arrayC.length

        arrayMatrizNormaAHP.push(arrayNormaAHP) // matriz normalizada
        arrayPesoFinalAHP.push(somaNormaAHP)
        
    }
    console.log(arrayMatrizNormaAHP)
    console.log(arrayPesoFinalAHP)// soma dos pesos da matriz normalizada



    // ================ calcular indice de consistencia ====================



    return arrayPesoFinalAHP  // soma dos pesos da matriz normalizada
    
    
    
}

function IcAHP(){

    PesosAHP()

    arrayMatrizIC = []
    
    
    for (let o = 0; o < arrayC.length; o++) {
        arrayCalcMatrizIC = []
        
        
        for (let p = 0; p < arrayC.length; p++) {
            
            calcMatrizIC =  arrayMatrizPriorAHP[p][o] * arrayPesoFinalAHP[o]
            arrayCalcMatrizIC.push(calcMatrizIC)
            
            
        }
        
        
        arrayMatrizIC.push(arrayCalcMatrizIC)
        
    }
    
    console.log(arrayMatrizIC)
    console.log(arrayPesoFinalAHP)


    arraySomaMatrizIC = []

    
    for (let q = 0; q < arrayC.length; q++) {
        
        somaMatrizIC = 0

        
        for (let r = 0; r < arrayC.length; r++) {
            
            somaMatrizIC += arrayMatrizIC[r][q] 
            
            
        }
        
        arraySomaMatrizIC.push(somaMatrizIC)

        
    }
        
    console.log(arraySomaMatrizIC)

    CalcSomaPesoIC = 0

    for (let s = 0; s < arrayC.length; s++) {

        CalcSomaPesoIC += (arraySomaMatrizIC[s] / arrayPesoFinalAHP[s])
        
    }
    mediaSomaPesoIC = CalcSomaPesoIC / arrayC.length

    calcIC = (mediaSomaPesoIC - (arrayC.length)) / (arrayC.length -1)

    
    console.log(mediaSomaPesoIC)
    
    console.log(calcIC)


    arrayCR = [ 0 , 0 , 0.58 , 0.90 , 1.12 , 1.24 , 1.32 , 1.41 , 1.45 , 1.49 , 1.51 , 1.48 , 1.56 , 1.57 , 1.59  ]

    tamanho = arrayC.length

    for (let t  = 0; t  < arrayCR.length; t ++) {

        if ( t == (arrayC.length -1 ))

         ValorCR = arrayCR[t]
        
    }

    console.log(arrayC.length)
    console.log(ValorCR)
    CalcCR = calcIC/ValorCR

    console.log(CalcCR)


    return CalcCR

}

// function CaulculoSAPEVO() {
    //     arrayC = GetArrayCriterios()
    //     arrayA = GetarrayAlternativas()
    //     arrayCombination = []
    //     arrayMatrizCombination = []

//     let combination = combine(arrayC, 2)



//     for (let i = 0; i < arrayC.length; i++) {

//         B = arrayC[i]

//         keys = Object.keys(localStorage).filter((key) => {
//             if (key.split('_')[1] == B && key.split('_')[0] == "Prio") {
//                 return key
//             }
//         }) 

        

//         arrayCombination.push(keys)

//         console.log(arrayCombination)

//     }
 
   

//     for (let j = 0; j < arrayC.length; j++) {
//             arrayComb = []
//             valor = 0

//         for (let k = 0; k < arrayC.length -1; k++) {

//             comb = arrayCombination[j][k]

//             if(j==k){
//                 arrayComb.push(valor)
//                 arrayComb.push(comb)

//             }else{
                
//                 arrayComb.push(comb)
//             }
//             if(j == arrayC.length -1 && k == arrayC.length -2){
                
//                 arrayComb.push(valor)
//                 console.log('teste')


//             }


//         }

//         arrayMatrizCombination.push(arrayComb)

//     }
//     console.log(arrayMatrizCombination)

// }

        





function combine(a, q) {
    var n = a.length - 1, l = n - q + 1, x = 0, c = [], z = -1, p, j, d, i;
    if (q > n || q < 2) return c;
    for (p = [], i = q; p[--i] = i;);
    while (x <= l) {
        for (c[++z] = [], j = -1; ++j < q; c[z][j] = a[p[j]]);
        if (++p[j - 1] > n)
            while (j--)
                if (!j && x++, (d = p[j]) < l + j) {
                    while (j < q) p[j++] = ++d;
                    break;
                }
    }
    return c;
};



function GetArrayCriterios() {
    let arrayCriterios = []
    // let arrayAlternativas = []

    qtdcriterios = Number(storage.getItem("kqtcriterio"))

    for (let i = 0; i < qtdcriterios; i++) {  // coloca cada valor do storage em um array
        arrayCriterios[i] = storage.getItem('criterio' + i)

    }
    // console.log(arrayCriterios)

    return arrayCriterios;
}
function GetArrayDecisor(){
    let arrayDecisor = []

    qtdDecisor = Number(storage.getItem("kqtDecisores"))
    
    console.log(qtdDecisor)
    for (let i = 0; i < qtdDecisor; i++) {
         arrayDecisor[i] = storage.getItem('decisor'+i)
        
    }

    return arrayDecisor
}




function GetarrayAlternativas() {
    let arrayAlternativas = []
    qtdalternativa = Number(storage.getItem("kqtalternativa"))

    for (let i = 0; i < qtdalternativa; i++) {  // coloca cada valor do storage em um array
        arrayAlternativas[i] = storage.getItem('alternativa' + i)

    }
    return arrayAlternativas;
}

function testeTabela() {

    // matris = TOPSIS_MatrisPonderamento()
    
    arrayC = GetArrayCriterios()
    arrayA = GetarrayAlternativas()

    if(storage.getItem("opt_metodo2") == "TOPSIS-2NE"){
        
        matris = TOPSIS_2N_MatrisPonderamento()

    }
    
    if(storage.getItem("opt_metodo2") == "TOPSIS-2N"){
        
        matris = TOPSIS_2N_MatrisPonderamento()

    }
    if(storage.getItem("opt_metodo2") == "TOPSIS"){

        matris = TOPSIS_MatrisPonderamento()    

        
    }

    console.log(matris)

    for (let i = 0; i < matris[0].length; i++) {
        linha = matris[i]

        $('table').append('<tr id="linha_t' + i + '"><th>' + arrayA[i] + '</th>' + linha + '</tr>');
        if (i == 0) {
            $('#table_h').append('<th></th>');

        }
        if (i <= matris.length) {

            $('#table_h').append('<th>' + arrayC[i] + '</th>');
        }

        for (let j = 0; j < matris.length; j++) {
            coluna = matris[j][i]
            $('#linha_t' + i + '').append('<td>' + coluna + '</td>');


        }
        // $('table tr:last-child').append('<th>' +arrayA[i]+ ' </th>')

    }
    console.log(arrayA)
}

function tabelaRanking() {
    // matris = TOPSIS_MatrisPonderamento()
 
  
    topsis = TOPSIS_MaxMIn()
    topsis_2ne = TOPSIS_2NE_teste() 


    arrayTOPSIS = []
    arrayC = GetArrayCriterios()
    console.log(topsis)
    arrayA = GetarrayAlternativas()

    AnaliseNome = storage.getItem("Nome_analise")


    document.getElementById("H1_Nome_Analise").innerHTML='Análise:'+AnaliseNome+''



    if(storage.getItem('opt_metodo2') == 'TOPSIS'){

        document.getElementById("btn_TOPSIS").setAttribute("disabled","disabled")

    }else if(storage.getItem('opt_metodo2') == 'TOPSIS-2NE'){

        document.getElementById("btn_TOPSIS2NE").setAttribute("disabled","disabled")

    }else if(storage.getItem('opt_metodo2') == 'TOPSIS-2N'){

        document.getElementById("btn_TOPSIS2N").setAttribute("disabled","disabled")
        

    }


// =============================================================== S+  S- ===========================================




if(storage.getItem('opt_metodo2') == 'TOPSIS' || storage.getItem('opt_metodo2') == 'TOPSIS-2N' ){


    for (let i = 0; i < arrayA.length; i++) {



        $('#t_body_PR').append('<tr class="border border-dark table-light" id="linhaPR' + i + '"><th class="border border-dark">' + arrayA[i] + '</th></tr>');





        for (let j = 0; j < 3; j++) {

            $('#linhaPR' + i + '').append('<td class="border border-dark">' + topsis[j][i].toFixed(3) + '</td>')


            // if(i == 2)




        }
        // $('#t_body_rank').append('<tr> </tr>') 

    }
    console.table(topsis)
}

// ==========================2NE==============================



if (storage.getItem("opt_metodo2") == "TOPSIS-2NE") {


    for (let a = 0; a < 2; a++) {
        $("#JS-PDF").append(`    
    
    
    <div class="row" id="${a+1}_normalizaçao" style="background: gainsboro;padding-bottom: 50px;border: 3px solid #000;padding-top: 10px;box-shadow: 10px 10px 10px; margin:25px">
    <div><h1 class="h1-div" style="text-align: center; background-color:antiquewhite; margin-top: 10px;"> Resultado da ${a+1}ª Normalização</h1></div>
    <div  class="col">
        <table  class="table table-bordered border border-dark" id="table_ranking" border="1">
            <thead>
                <th style="text-align: center"></th>
                <th style="text-align: center">Soma Ideal</th>
                <th style="text-align: center">Soma Anti-Ideal</th>
                <th style="text-align: center">Media Ideal</th>
                <th style="text-align: center">Media Anti-Ideal</th>
            </thead>
            <tbody id="t_body_2NE_${a}"></tbody>
            <tfoot></tfoot>
        </table>
    </div>


    <div class="col div_tabela_PR">
    <table  class="table table-bordered border border-dark" id="table_PR" border="1">
        <thead>

            <th>rank</th>
            <th>Soma Ideal</th>
            <th>Soma Não Ideal</th>
            <th>Media Ideal</th>
            <th>Media Não Ideal</th>
        </thead>
        <tbody id="t_body_ranking_${a+1}"></tbody>
        <tfoot></tfoot>
    </table>
</div>
</div>


    `);

    document.getElementById('tabela_topsis').style="display:none";
    // document.getElementById('1_normalizaçao').style="display:none;";

}
        
    for (let b = 0; b < arrayA.length; b++) {
            $('#t_body_2NE_0').append('<tr class="border border-dark table-light" id="linha_t1_2NE_'+ b + '"><th class="border border-dark table-light">' + arrayA[b] + "</th></tr>");

        for (let c = 0; c < 4; c++) {
            $('#linha_t1_2NE_'+ b).append('<td class=" border border-dark">' + topsis_2ne[c][b].toFixed(7) + "</td>");
        }
    }
    
    for (let d = 0; d < arrayA.length; d++) {
        $("#t_body_2NE_1").append('<tr class="border border-dark table-light" id="linha_t2_2NE_' + d + '"><th class="border border-dark table-light">' + arrayA[d] + "</th></tr>");

        for (let e = 4; e < 8; e++) {
            $("#linha_t2_2NE_" + d).append('<td class="border border-dark">' + topsis_2ne[e][d].toFixed(7) + "</td>");
        }
    }
}




// =================================== ranking ===================================

    topsis = TOPSIS_MaxMIn()
    pr = topsis[2]
    objeto0 = consolidateCriteriosALternativas(arrayA, pr)
    console.log(objeto0)
    objeto0.sort((a,b) => b.valor - a.valor)





    if(storage.getItem("opt_metodo2") == "TOPSIS" || storage.getItem("opt_metodo2") == "TOPSIS-2N"){

        for (const [i,item] of objeto0.entries()) {
    
            
            
            $('#t_body_ranking_0').append(`
                <tr class="table-light" >
                    <td class="td-tableR border border-dark" style="text-align: center">${i+1}</td>
                    <td class="td-tableR border border-dark" style="text-align: center">${item.name}</td>
                    <td class="td-tableR border border-dark" style="text-align: center">${item.valor.toFixed(3)}</td>
                </tr>
            `)
        }
            
    }

    
// console.log(objeto)
// ============================================================================

TS_2_ne = TOPSIS_2NE_teste()

soma_i_1n = TS_2_ne[0]
soma_n_i_1n = TS_2_ne[1]
media_i_1n = TS_2_ne[2]
soma_n_i_1n = TS_2_ne[3]


soma_i_2n = TS_2_ne[4]
soma_n_i_2n = TS_2_ne[5]
media_i_2n = TS_2_ne[6]
soma_n_i_2n = TS_2_ne[7]




for (let x = 1; x < 3; x++) {

    if(x == 1){

        objeto1 = consolidateCriteriosALternativas(arrayA, soma_i_1n)
        objeto2 = consolidateCriteriosALternativas(arrayA, soma_n_i_1n)
        objeto3 = consolidateCriteriosALternativas(arrayA, media_i_1n)
        objeto4 = consolidateCriteriosALternativas(arrayA, soma_n_i_1n)
    }else{

        objeto1 = consolidateCriteriosALternativas(arrayA, soma_i_2n)
        objeto2 = consolidateCriteriosALternativas(arrayA, soma_n_i_2n)
        objeto3 = consolidateCriteriosALternativas(arrayA, media_i_2n)
        objeto4 = consolidateCriteriosALternativas(arrayA, soma_n_i_2n)

    }



    objeto1.sort((a,b) => b.valor - a.valor)
    objeto2.sort((a,b) => b.valor - a.valor)
    objeto3.sort((a,b) => b.valor - a.valor)
    objeto4.sort((a,b) => b.valor - a.valor)



    for (const [i, item] of objeto1.entries()) {
        $('#t_body_ranking_'+x).append(`
        <tr class="table-light" >


            <td class="td-tableR border border-dark" style="text-align: center">${i + 1}</td>
            <td class="td-tableR border border-dark" style="text-align: center">${objeto1[i].name}</td>
            <td class="td-tableR border border-dark" style="text-align: center">${objeto2[i].name}</td>
            <td class="td-tableR border border-dark" style="text-align: center">${objeto3[i].name}</td>
            <td class="td-tableR border border-dark" style="text-align: center">${objeto4[i].name}</td>

        </tr>
    `);
    }
}

}

function consolidateCriteriosALternativas(criterios, pontuacao) {

    const result = [];

    for (let i = 0; i < pontuacao.length; i++) {
        result.push({
            name: criterios[i],
            valor: pontuacao[i]
        })

    }


    return result
}


function TOPSIS_2N_MatrisPonderamento() {

    matriz = TOPSIS_MatrisPonderamento()
    arrayPond2N = []
    arrayC = GetArrayCriterios()
    arrayA = GetarrayAlternativas() 

    for (let i = 0; i < arrayC.length; i++) {

        arrayPond2NX = []



        for (let j = 0; j < arrayA.length; j++) {



            min = (Math.min.apply(Math, matriz[i]))
            max = (Math.max.apply(Math, matriz[i]))
            
            Norm2N = (matriz[i][j] - (Math.min.apply(Math, matriz[i]))) / ((Math.max.apply(Math, matriz[i])) - (Math.min.apply(Math, matriz[i])))

            if(storage.getItem("opt_metodo1") == "AD"){

                valorPeso = Number(storage.getItem("Peso_" + arrayC[i]))
            }
            if(storage.getItem("opt_metodo1") == "SAPEVO"){
                valorPeso = PesosSAPEVO()

            }
            if(storage.getItem("opt_metodo1") == "AHP"){

                valorPeso = PesosAHP()

            }

            if(!(storage.getItem("opt_metodo1") == "AD")){
                
                ponderando2N = Norm2N * valorPeso[i]
            }
            else{
                ponderando2N = Norm2N * valorPeso

            }

            arrayPond2NX.push(ponderando2N)

            console.log(arrayPond2N)


        }
        arrayPond2N.push(arrayPond2NX)

        
    }
    
    console.log(arrayPond2N)

    return arrayPond2N


}

function TOPSIS_MatrisPonderamento() {

    arrayA = GetarrayAlternativas()
    arrayC = GetArrayCriterios()
    ponderando = 0
    matris = ObterMatris()

    arrayData = []
    // ================================ ponderando a matrix =========================

    for (let k = 0; k < arrayC.length; k++) {

        arrayRow = []

        // $('table').append('<tr></tr>');
        // $('#table_h').append('<th>' +datas[k][k].name+ '</th>');

        for (let l = 0; l < arrayA.length; l++) {

            if(storage.getItem("opt_metodo1") == "AD"){

                valorPeso = storage.getItem("Peso_" + arrayC[k])
                ponderando = (matris[k][l] / squareSUMarray(matris[k])) * valorPeso
            }
            if(storage.getItem("opt_metodo1") == "SAPEVO")
            {
                valorPeso = PesosSAPEVO()
                ponderando = (matris[k][l] / squareSUMarray(matris[k])) * valorPeso[k]

            }
            if(storage.getItem("opt_metodo1") == "AHP"){

                
                valorPeso = PesosAHP()
                console.log(valorPeso[k])
                ponderando = (matris[k][l] / squareSUMarray(matris[k])) * valorPeso[k]


            }

            // console.log(valorPeso)

            // console.log(ponderando)

            arrayRow.push(ponderando)
            // console.log(arrayRow)
            // $('table tr:last-child').append('<td>' + ponderando + '</td>');

        }
        arrayData.push(arrayRow)
        // $('table tr:last-child').append('<th>' + arrayC[k]  + ' </th>')

    }
    // console.log(arrayData)
    return arrayData
}


function TOPSIS_2NE_1NOR_MatrizPonderamento() { 
    // =============================Pegando a matriz dos Criterios ========================

    const MatrizCriterios = ObterMatris();
    let mediaMatrizCriterios = 0;
    let arraySomaMatrizCriterios = [];
    let arrayMediaMatrizCriterios = [];
    const arrayC = GetArrayCriterios();
    const arrayA = GetarrayAlternativas();
    matriz = ObterMatris()
    // normalizando = (matriz[k][l] / squareSUMarray(matriz[k]))


    arrayObjetoSomatorio = []


    for (let i = 0; i < arrayC.length; i++) {
        somaMatrizCriterios = 0;

        for (let j = 0; j < arrayA.length; j++) {
            somaMatrizCriterios += Number(MatrizCriterios[i][j]);
        }
        mediaMatrizCriterios = somaMatrizCriterios / MatrizCriterios.length;

        arrayMediaMatrizCriterios.push(mediaMatrizCriterios);
        arraySomaMatrizCriterios.push(somaMatrizCriterios);

        console.log(arrayMediaMatrizCriterios);
        console.log(arraySomaMatrizCriterios);
    }



    for (let a = 0; a < arrayC.length; a++) {
        // ====================================Normalização da Media ===========================

        let arrayNormaMedia = [];
        let arrayNormaSoma = [];

        for (let k = 0; k < arrayC.length; k++) {
            var arrayforMedia = [];
            var arrayforSoma = [];

            for (let l = 0; l < arrayA.length; l++) {

                let norma = (matriz[k][l] / squareSUMarray(matriz[k])) 

                normaMedia = norma / arrayMediaMatrizCriterios[k];
                normaSoma = norma / arraySomaMatrizCriterios[k];

                arrayforMedia.push(normaMedia);
                arrayforSoma.push(normaSoma);
            }

            arrayNormaMedia.push(arrayforMedia);
            arrayNormaSoma.push(arrayforSoma);

            
        }

        console.log(arrayNormaMedia)
        console.log(arrayNormaSoma)

        // =============================== Ponderando a normalização ==================

        arrayNormPondSoma = [];
        arrayNormPondMedia = [];

        for (let m = 0; m < arrayC.length; m++) {
            // NormPondSoma = 0
            // NormPondMedia = 0

            arrayforPondMedia = [];
            arrayforPondSoma = [];
            for (let n = 0; n < arrayA.length; n++) {
                if (storage.getItem("opt_metodo1") == "AD") {
                    PesoMetodo = storage.getItem("Peso_" + arrayC[m]);
                    Number(PesoMetodo);
                    vi = arrayNormaSoma[m][n];
                    xi = arrayNormaMedia[m][n];

                    NormPondSoma = arrayNormaSoma[m][n] * PesoMetodo;
                    NormPondMedia = arrayNormaMedia[m][n] * PesoMetodo;
                }
                if (storage.getItem("opt_metodo1") == "SAPEVO") {
                    PesoMetodo = PesosSAPEVO();
                    NormPondSoma = arrayNormaSoma[m][n] * PesoMetodo[m];
                    NormPondMedia = arrayNormaMedia[m][n] * PesoMetodo[m];
                }
                if (storage.getItem("opt_metodo1") == "AHP") {
                    PesoMetodo = PesosAHP();
                    NormPondSoma = arrayNormaSoma[m][n] * PesoMetodo[m];
                    NormPondMedia = arrayNormaMedia[m][n] * PesoMetodo[m];
                }

                arrayforPondMedia.push(NormPondMedia);
                arrayforPondSoma.push(NormPondSoma);
            }

            arrayNormPondMedia.push(arrayforPondMedia);
            arrayNormPondSoma.push(arrayforPondSoma);
        }

        // console.log("media",arrayNormPondMedia[a])
        // console.log("soma",arrayNormPondSoma[a])

        
        let S_ideal_SOMA_1NOR_2NE = 0
        let S_ideal_MEDIA_1NOR_2NE = 0

        let  S_n_ideal_SOMA_1NOR_2NE = 0
        let  S_n_ideal_MEDIA_1NOR_2NE = 0


        MinMax_2NE = storage.getItem('MinMax_' + a)

        
        if (MinMax_2NE === 'Max') {
    
            S_ideal_SOMA_1NOR_2NE = (Math.max.apply(Math, arrayNormPondSoma[a]))
            S_n_ideal_SOMA_1NOR_2NE = (Math.min.apply(Math, arrayNormPondSoma[a]))

    
            S_ideal_MEDIA_1NOR_2NE = (Math.max.apply(Math, arrayNormPondMedia[a]))
            S_n_ideal_MEDIA_1NOR_2NE = (Math.min.apply(Math, arrayNormPondMedia[a]))

        }
        if (MinMax_2NE === 'Min') {
            S_ideal_SOMA_1NOR_2NE = (Math.min.apply(Math, arrayNormPondSoma[a]))
            S_n_ideal_SOMA_1NOR_2NE = (Math.max.apply(Math, arrayNormPondSoma[a]))

    
            S_ideal_MEDIA_1NOR_2NE = (Math.min.apply(Math, arrayNormPondMedia[a]))
            S_n_ideal_MEDIA_1NOR_2NE = (Math.max.apply(Math, arrayNormPondMedia[a]))

        }

        // console.log(arrayC[a]+" ideal soma",S_ideal_SOMA_1NOR_2NE)
        // console.log(arrayC[a]+" ideal media",S_ideal_MEDIA_1NOR_2NE)

        // console.log(arrayC[a]+" não ideal soma",S_n_ideal_SOMA_1NOR_2NE)
        // console.log(arrayC[a]+" não ideal media",S_n_ideal_MEDIA_1NOR_2NE)




// ================================= formula c2 = a2 - b2 ================================





        let formulaC_media = Math.sqrt(Math.abs((S_ideal_MEDIA_1NOR_2NE * S_ideal_MEDIA_1NOR_2NE) - (S_n_ideal_MEDIA_1NOR_2NE * S_n_ideal_MEDIA_1NOR_2NE)))

        let = formulaC_soma = Math.sqrt(Math.abs((S_ideal_SOMA_1NOR_2NE * S_ideal_SOMA_1NOR_2NE) - (S_n_ideal_SOMA_1NOR_2NE * S_n_ideal_SOMA_1NOR_2NE)))



        // console.log(formulaC_media)
        // console.log(formulaC_soma)


        
// =============================================== excentricidade eliptica ====================================


        let Ext_Eli_Media = formulaC_media / S_ideal_MEDIA_1NOR_2NE

        let Ext_Eli_Soma = formulaC_soma / S_ideal_SOMA_1NOR_2NE



// ================================= Calc Distancia eliptica =======================================================

        let pi = 3.141592654

        let Dis_el_Pos_Media = 0
        let Dis_el_Neg_Media = 0

        let Dis_el_Pos_Soma = 0
        let Dis_el_Neg_Soma = 0

        

        array_Dis_el_Pos_Media = []
        array_Dis_el_Neg_Media = []

        array_Dis_el_Pos_Soma = []
        array_Dis_el_Neg_Soma = []



        let Somatorio_Dis_el_Pos_Media = 0

        let Somatorio_Dis_el_Neg_Media = 0

        let Somatorio_Dis_el_Pos_Soma = 0

        let Somatorio_Dis_el_Neg_Soma = 0


        arraySomatorio_Dis_el_Pos_Media = []

        arraySomatorio_Dis_el_Neg_Media = []

        arraySomatorio_Dis_el_Pos_Soma = []

        arraySomatorio_Dis_el_Neg_Soma = []


        
        
        for (let p = 0; p < arrayA.length; p++) {
            
            arrayForObjeto = []
            
            varNormPond_media = arrayNormPondMedia[a][p]
            varNormPond_soma = arrayNormPondSoma[a][p]

            
            Dis_el_Pos_Media = (pi * (varNormPond_media * S_ideal_MEDIA_1NOR_2NE))  * ( 2 - ((Ext_Eli_Media * Ext_Eli_Media) /2 ) - ( 3 * (Math.pow(Ext_Eli_Media,4)) / 32 ) - (5 * ((Math.pow(Ext_Eli_Media,6) ))  / 128 ))
            
            Dis_el_Neg_Media = (pi * (varNormPond_media * S_n_ideal_MEDIA_1NOR_2NE))  * ( 2 - ((Ext_Eli_Media * Ext_Eli_Media) /2 ) - ( 3 * (Math.pow(Ext_Eli_Media,4)) / 32 ) - (5 * ((Math.pow(Ext_Eli_Media,6) ))  / 128 ))



            Dis_el_Pos_Soma = (pi * (varNormPond_soma * S_ideal_SOMA_1NOR_2NE))  * ( 2 - ((Ext_Eli_Soma * Ext_Eli_Soma) /2 ) - ( 3 * (Math.pow(Ext_Eli_Soma,4)) / 32 ) - (5 * ((Math.pow(Ext_Eli_Soma,6) ))  / 128 ))

            Dis_el_Neg_Soma = (pi * (varNormPond_soma * S_n_ideal_SOMA_1NOR_2NE))  * ( 2 - ((Ext_Eli_Soma * Ext_Eli_Soma) /2 ) - ( 3 * (Math.pow(Ext_Eli_Soma,4)) / 32 ) - (5 * ((Math.pow(Ext_Eli_Soma,6) ))  / 128 ))


            array_Dis_el_Pos_Media.push(Dis_el_Pos_Media)
            array_Dis_el_Neg_Media.push(Dis_el_Neg_Media)


            array_Dis_el_Pos_Soma.push(Dis_el_Pos_Soma)
            array_Dis_el_Neg_Soma.push(Dis_el_Neg_Soma)



            objetoSoma = {
                nome: arrayC[a],
                DisEl_Pos_Media: array_Dis_el_Pos_Media,
                DisEl_Neg_Media: array_Dis_el_Neg_Media,
                DisEl_Pos_Soma:  array_Dis_el_Pos_Soma,
                DisEl_Neg_Soma:  array_Dis_el_Neg_Soma,

            }


            // arrayForObjeto.push(objetoSoma)
                
        }

        arrayObjetoSomatorio.push(objetoSoma)
        

        
        console.log(arrayObjetoSomatorio)

    }


// ================================================== somatorio Distancia eliptica ========================

    arraySomatorio_DisEl_Pos_Media = []
    arraySomatorio_DisEl_Neg_Media = []
    arraySomatorio_DisEl_Pos_Soma = []
    arraySomatorio_DisEl_Neg_Soma = []

    for (let b = 0; b < arrayA.length; b++) {
        
        
        Somatorio_DisEl_Pos_Media = 0
        Somatorio_DisEl_Neg_Media = 0
        Somatorio_DisEl_Pos_Soma = 0
        Somatorio_DisEl_Neg_Soma = 0
        
    
        
        for (let r = 0; r < arrayC.length; r++) {
            
            PosMedia = arrayObjetoSomatorio[r].DisEl_Pos_Media[b]
            NegMedia = arrayObjetoSomatorio[r].DisEl_Neg_Media[b]
            PosSoma = arrayObjetoSomatorio[r].DisEl_Pos_Soma[b]
            NegSoma = arrayObjetoSomatorio[r].DisEl_Neg_Soma[b]


            Somatorio_DisEl_Pos_Media += PosMedia
            Somatorio_DisEl_Neg_Media += NegMedia
            Somatorio_DisEl_Pos_Soma += PosSoma
            Somatorio_DisEl_Neg_Soma += NegSoma




        }

        arraySomatorio_DisEl_Pos_Media.push(Somatorio_DisEl_Pos_Media)
        arraySomatorio_DisEl_Neg_Media.push(Somatorio_DisEl_Neg_Media)
        arraySomatorio_DisEl_Pos_Soma.push(Somatorio_DisEl_Pos_Soma)
        arraySomatorio_DisEl_Neg_Soma.push(Somatorio_DisEl_Neg_Soma)

    }
    
    
    console.log(arraySomatorio_DisEl_Pos_Media)
    console.log(arraySomatorio_DisEl_Neg_Media)
    console.log(arraySomatorio_DisEl_Pos_Soma)
    console.log(arraySomatorio_DisEl_Neg_Soma)





    array_E_Soma_ideal = []
    array_E_Soma_anti_ideal = []  
    array_E_Media_ideal = [] 
    array_E_Media_anti_ideal = [] 


    for (let s = 0; s < arrayA.length; s++) {

    E_Soma_ideal = (arraySomatorio_DisEl_Neg_Soma[s] / (arraySomatorio_DisEl_Neg_Soma[s] + arraySomatorio_DisEl_Pos_Soma[s] ))

    E_Soma_anti_ideal =  (arraySomatorio_DisEl_Pos_Soma[s] / (arraySomatorio_DisEl_Neg_Soma[s] + arraySomatorio_DisEl_Pos_Soma[s] ))

    E_Media_ideal = (arraySomatorio_DisEl_Neg_Media[s] / (arraySomatorio_DisEl_Pos_Media[s] + arraySomatorio_DisEl_Neg_Media[s] ) )

    E_Media_anti_ideal = (arraySomatorio_DisEl_Pos_Media[s] / (arraySomatorio_DisEl_Pos_Media[s] + arraySomatorio_DisEl_Neg_Media[s] ) )
        

    array_E_Soma_ideal.push(E_Soma_ideal)
    array_E_Soma_anti_ideal.push(E_Soma_anti_ideal) 
    array_E_Media_ideal.push(E_Media_ideal)
    array_E_Media_anti_ideal.push(E_Media_anti_ideal)


    console.log(array_E_Soma_ideal)
    console.log(array_E_Soma_anti_ideal)

    console.log(array_E_Media_ideal)
    console.log(array_E_Media_anti_ideal)
        
    }


return [array_E_Soma_ideal , array_E_Soma_anti_ideal , array_E_Media_ideal, array_E_Media_anti_ideal  ]
}


function TOPSIS_2NE_2NOR_MatrizPonderamento() {
    Matriz_TOPSIS_1N_Pond = TOPSIS_MatrisPonderamento();



    const MatrizCriterios = ObterMatris();
    let mediaMatrizCriterios = 0;
    let arraySomaMatrizCriterios = [];
    let arrayMediaMatrizCriterios = [];
    const arrayC = GetArrayCriterios();
    const arrayA = GetarrayAlternativas();
    matriz = ObterMatris()
    // normalizando = (matriz[k][l] / squareSUMarray(matriz[k]))




    array_Norm2_TOPSIS_2NE = [];

    for (let x = 0; x < arrayC.length; x++) {
        arrayfor = [];

        for (let z = 0; z < arrayA.length; z++) {
            Norm2_TOPSIS_2NE = Matriz_TOPSIS_1N_Pond[x][z] / Math.max.apply(Math, Matriz_TOPSIS_1N_Pond[x]);

            arrayfor.push(Norm2_TOPSIS_2NE);
        }

        array_Norm2_TOPSIS_2NE.push(arrayfor);
    }

    console.log(array_Norm2_TOPSIS_2NE);




    // ==============================================================================






    arrayObjetoSomatorio = []


    for (let i = 0; i < arrayC.length; i++) {
        somaMatrizCriterios = 0;

        for (let j = 0; j < arrayA.length; j++) {
            somaMatrizCriterios += Number(MatrizCriterios[i][j]);
        }
        mediaMatrizCriterios = somaMatrizCriterios / MatrizCriterios.length;

        arrayMediaMatrizCriterios.push(mediaMatrizCriterios);
        arraySomaMatrizCriterios.push(somaMatrizCriterios);

        console.log(arrayMediaMatrizCriterios);
        console.log(arraySomaMatrizCriterios);
    }



    for (let a = 0; a < arrayC.length; a++) {
        // ====================================Normalização da Media ===========================

        let arrayNormaMedia = [];
        let arrayNormaSoma = [];

        for (let k = 0; k < arrayC.length; k++) {
            var arrayforMedia = [];
            var arrayforSoma = [];

            for (let l = 0; l < arrayA.length; l++) {

               

                normaMedia = array_Norm2_TOPSIS_2NE[k][l] / arrayMediaMatrizCriterios[k];
                normaSoma = array_Norm2_TOPSIS_2NE[k][l] / arraySomaMatrizCriterios[k];

                arrayforMedia.push(normaMedia);
                arrayforSoma.push(normaSoma);
            }

            arrayNormaMedia.push(arrayforMedia);
            arrayNormaSoma.push(arrayforSoma);

            
        }

        console.log(arrayNormaMedia)
        console.log(arrayNormaSoma)

        // =============================== Ponderando a normalização ==================

        arrayNormPondSoma = [];
        arrayNormPondMedia = [];

        for (let m = 0; m < arrayC.length; m++) {
            // NormPondSoma = 0
            // NormPondMedia = 0

            arrayforPondMedia = [];
            arrayforPondSoma = [];
            for (let n = 0; n < arrayA.length; n++) {
                if (storage.getItem("opt_metodo1") == "AD") {
                    PesoMetodo = storage.getItem("Peso_" + arrayC[m]);
                    Number(PesoMetodo);
                    vi = arrayNormaSoma[m][n];
                    xi = arrayNormaMedia[m][n];

                    NormPondSoma = arrayNormaSoma[m][n] * PesoMetodo;
                    NormPondMedia = arrayNormaMedia[m][n] * PesoMetodo;
                }
                if (storage.getItem("opt_metodo1") == "SAPEVO") {
                    PesoMetodo = PesosSAPEVO();
                    NormPondSoma = arrayNormaSoma[m][n] * PesoMetodo[m];
                    NormPondMedia = arrayNormaMedia[m][n] * PesoMetodo[m];
                }
                if (storage.getItem("opt_metodo1") == "AHP") {
                    PesoMetodo = PesosAHP();
                    NormPondSoma = arrayNormaSoma[m][n] * PesoMetodo[m];
                    NormPondMedia = arrayNormaMedia[m][n] * PesoMetodo[m];
                }

                arrayforPondMedia.push(NormPondMedia);
                arrayforPondSoma.push(NormPondSoma);
            }

            arrayNormPondMedia.push(arrayforPondMedia);
            arrayNormPondSoma.push(arrayforPondSoma);
        }

        // console.log("media",arrayNormPondMedia[a])
        // console.log("soma",arrayNormPondSoma[a])

        
        let S_ideal_SOMA_1NOR_2NE = 0
        let S_ideal_MEDIA_1NOR_2NE = 0

        let  S_n_ideal_SOMA_1NOR_2NE = 0
        let  S_n_ideal_MEDIA_1NOR_2NE = 0


        MinMax_2NE = storage.getItem('MinMax_' + a)

        
        if (MinMax_2NE === 'Max') {
    
            S_ideal_SOMA_1NOR_2NE = (Math.max.apply(Math, arrayNormPondSoma[a]))
            S_n_ideal_SOMA_1NOR_2NE = (Math.min.apply(Math, arrayNormPondSoma[a]))

    
            S_ideal_MEDIA_1NOR_2NE = (Math.max.apply(Math, arrayNormPondMedia[a]))
            S_n_ideal_MEDIA_1NOR_2NE = (Math.min.apply(Math, arrayNormPondMedia[a]))

        }
        if (MinMax_2NE === 'Min') {
            S_ideal_SOMA_1NOR_2NE = (Math.min.apply(Math, arrayNormPondSoma[a]))
            S_n_ideal_SOMA_1NOR_2NE = (Math.max.apply(Math, arrayNormPondSoma[a]))

    
            S_ideal_MEDIA_1NOR_2NE = (Math.min.apply(Math, arrayNormPondMedia[a]))
            S_n_ideal_MEDIA_1NOR_2NE = (Math.max.apply(Math, arrayNormPondMedia[a]))

        }

        // console.log(arrayC[a]+" ideal soma",S_ideal_SOMA_1NOR_2NE)
        // console.log(arrayC[a]+" ideal media",S_ideal_MEDIA_1NOR_2NE)

        // console.log(arrayC[a]+" não ideal soma",S_n_ideal_SOMA_1NOR_2NE)
        // console.log(arrayC[a]+" não ideal media",S_n_ideal_MEDIA_1NOR_2NE)




// ================================= formula c2 = a2 - b2 ================================





        let formulaC_media = Math.sqrt(Math.abs((S_ideal_MEDIA_1NOR_2NE * S_ideal_MEDIA_1NOR_2NE) - (S_n_ideal_MEDIA_1NOR_2NE * S_n_ideal_MEDIA_1NOR_2NE)))

        let = formulaC_soma = Math.sqrt(Math.abs((S_ideal_SOMA_1NOR_2NE * S_ideal_SOMA_1NOR_2NE) - (S_n_ideal_SOMA_1NOR_2NE * S_n_ideal_SOMA_1NOR_2NE)))



        // console.log(formulaC_media)
        // console.log(formulaC_soma)


        
// =============================================== excentricidade eliptica ====================================


        let Ext_Eli_Media = formulaC_media / S_ideal_MEDIA_1NOR_2NE

        let Ext_Eli_Soma = formulaC_soma / S_ideal_SOMA_1NOR_2NE



// ================================= Calc Distancia eliptica =======================================================

        let pi = 3.141592654

        let Dis_el_Pos_Media = 0
        let Dis_el_Neg_Media = 0

        let Dis_el_Pos_Soma = 0
        let Dis_el_Neg_Soma = 0

        

        array_Dis_el_Pos_Media = []
        array_Dis_el_Neg_Media = []

        array_Dis_el_Pos_Soma = []
        array_Dis_el_Neg_Soma = []



        let Somatorio_Dis_el_Pos_Media = 0

        let Somatorio_Dis_el_Neg_Media = 0

        let Somatorio_Dis_el_Pos_Soma = 0

        let Somatorio_Dis_el_Neg_Soma = 0


        arraySomatorio_Dis_el_Pos_Media = []

        arraySomatorio_Dis_el_Neg_Media = []

        arraySomatorio_Dis_el_Pos_Soma = []

        arraySomatorio_Dis_el_Neg_Soma = []


        
        
        for (let p = 0; p < arrayA.length; p++) {
            
            arrayForObjeto = []
            
            varNormPond_media = arrayNormPondMedia[a][p]
            varNormPond_soma = arrayNormPondSoma[a][p]

            
            Dis_el_Pos_Media = (pi * (varNormPond_media * S_ideal_MEDIA_1NOR_2NE))  * ( 2 - ((Ext_Eli_Media * Ext_Eli_Media) /2 ) - ( 3 * (Math.pow(Ext_Eli_Media,4)) / 32 ) - (5 * ((Math.pow(Ext_Eli_Media,6) ))  / 128 ))
            
            Dis_el_Neg_Media = (pi * (varNormPond_media * S_n_ideal_MEDIA_1NOR_2NE))  * ( 2 - ((Ext_Eli_Media * Ext_Eli_Media) /2 ) - ( 3 * (Math.pow(Ext_Eli_Media,4)) / 32 ) - (5 * ((Math.pow(Ext_Eli_Media,6) ))  / 128 ))



            Dis_el_Pos_Soma = (pi * (varNormPond_soma * S_ideal_SOMA_1NOR_2NE))  * ( 2 - ((Ext_Eli_Soma * Ext_Eli_Soma) /2 ) - ( 3 * (Math.pow(Ext_Eli_Soma,4)) / 32 ) - (5 * ((Math.pow(Ext_Eli_Soma,6) ))  / 128 ))

            Dis_el_Neg_Soma = (pi * (varNormPond_soma * S_n_ideal_SOMA_1NOR_2NE))  * ( 2 - ((Ext_Eli_Soma * Ext_Eli_Soma) /2 ) - ( 3 * (Math.pow(Ext_Eli_Soma,4)) / 32 ) - (5 * ((Math.pow(Ext_Eli_Soma,6) ))  / 128 ))


            array_Dis_el_Pos_Media.push(Dis_el_Pos_Media)
            array_Dis_el_Neg_Media.push(Dis_el_Neg_Media)


            array_Dis_el_Pos_Soma.push(Dis_el_Pos_Soma)
            array_Dis_el_Neg_Soma.push(Dis_el_Neg_Soma)



            objetoSoma = {
                nome: arrayC[a],
                DisEl_Pos_Media: array_Dis_el_Pos_Media,
                DisEl_Neg_Media: array_Dis_el_Neg_Media,
                DisEl_Pos_Soma:  array_Dis_el_Pos_Soma,
                DisEl_Neg_Soma:  array_Dis_el_Neg_Soma,

            }


            // arrayForObjeto.push(objetoSoma)
                
        }

        arrayObjetoSomatorio.push(objetoSoma)
        

        
        console.log(arrayObjetoSomatorio)

    }


// ================================================== somatorio Distancia eliptica ========================

    arraySomatorio_DisEl_Pos_Media = []
    arraySomatorio_DisEl_Neg_Media = []
    arraySomatorio_DisEl_Pos_Soma = []
    arraySomatorio_DisEl_Neg_Soma = []

    for (let b = 0; b < arrayA.length; b++) {
        
        
        Somatorio_DisEl_Pos_Media = 0
        Somatorio_DisEl_Neg_Media = 0
        Somatorio_DisEl_Pos_Soma = 0
        Somatorio_DisEl_Neg_Soma = 0
        
    
        
        for (let r = 0; r < arrayC.length; r++) {
            
            PosMedia = arrayObjetoSomatorio[r].DisEl_Pos_Media[b]
            NegMedia = arrayObjetoSomatorio[r].DisEl_Neg_Media[b]
            PosSoma = arrayObjetoSomatorio[r].DisEl_Pos_Soma[b]
            NegSoma = arrayObjetoSomatorio[r].DisEl_Neg_Soma[b]


            Somatorio_DisEl_Pos_Media += PosMedia
            Somatorio_DisEl_Neg_Media += NegMedia
            Somatorio_DisEl_Pos_Soma += PosSoma
            Somatorio_DisEl_Neg_Soma += NegSoma




        }

        arraySomatorio_DisEl_Pos_Media.push(Somatorio_DisEl_Pos_Media)
        arraySomatorio_DisEl_Neg_Media.push(Somatorio_DisEl_Neg_Media)
        arraySomatorio_DisEl_Pos_Soma.push(Somatorio_DisEl_Pos_Soma)
        arraySomatorio_DisEl_Neg_Soma.push(Somatorio_DisEl_Neg_Soma)

    }
    
    
    console.log(arraySomatorio_DisEl_Pos_Media)
    console.log(arraySomatorio_DisEl_Neg_Media)
    console.log(arraySomatorio_DisEl_Pos_Soma)
    console.log(arraySomatorio_DisEl_Neg_Soma)





    array_E_Soma_ideal = []
    array_E_Soma_anti_ideal = []  
    array_E_Media_ideal = [] 
    array_E_Media_anti_ideal = [] 


    for (let s = 0; s < arrayA.length; s++) {

    E_Soma_ideal = (arraySomatorio_DisEl_Neg_Soma[s] / (arraySomatorio_DisEl_Neg_Soma[s] + arraySomatorio_DisEl_Pos_Soma[s] ))

    E_Soma_anti_ideal =  (arraySomatorio_DisEl_Pos_Soma[s] / (arraySomatorio_DisEl_Neg_Soma[s] + arraySomatorio_DisEl_Pos_Soma[s] ))

    E_Media_ideal = (arraySomatorio_DisEl_Neg_Media[s] / (arraySomatorio_DisEl_Pos_Media[s] + arraySomatorio_DisEl_Neg_Media[s] ) )

    E_Media_anti_ideal = (arraySomatorio_DisEl_Pos_Media[s] / (arraySomatorio_DisEl_Pos_Media[s] + arraySomatorio_DisEl_Neg_Media[s] ) )
        

    array_E_Soma_ideal.push(E_Soma_ideal)
    array_E_Soma_anti_ideal.push(E_Soma_anti_ideal) 
    array_E_Media_ideal.push(E_Media_ideal)
    array_E_Media_anti_ideal.push(E_Media_anti_ideal)


    console.log(array_E_Soma_ideal)
    console.log(array_E_Soma_anti_ideal)

    console.log(array_E_Media_ideal)
    console.log(array_E_Media_anti_ideal)
        

               
    }

    return [array_E_Soma_ideal ,array_E_Soma_anti_ideal,array_E_Media_ideal,array_E_Media_anti_ideal ]
}


function TOPSIS_2NE_teste() {
    // =============================Pegando a matriz dos Criterios ========================


    count = 0 

    Matriz_TOPSIS_1N_Pond = TOPSIS_MatrisPonderamento();

    const MatrizCriterios = ObterMatris();
    let mediaMatrizCriterios = 0;
    let arraySomaMatrizCriterios = [];
    let arrayMediaMatrizCriterios = [];
    
    
    
    
    const arrayC = GetArrayCriterios();
    const arrayA = GetarrayAlternativas();
    matriz = ObterMatris();
    
        array_E_Soma_ideal_1N = [] 
        array_E_Soma_anti_ideal_1N = []
        array_E_Media_ideal_1N = []
        array_E_Media_anti_ideal_1N = []
    
        array_E_Soma_ideal_2N = [] 
        array_E_Soma_anti_ideal_2N = []
        array_E_Media_ideal_2N = []
        array_E_Media_anti_ideal_2N = []
    
    
        // normalizando = (matriz[k][l] / squareSUMarray(matriz[k]))
    
    array_Norm2_TOPSIS_2NE = [];
    
    for (let x = 0; x < arrayC.length; x++) {
        arrayfor = [];

        for (let z = 0; z < arrayA.length; z++) {
            Norm2_TOPSIS_2NE = Matriz_TOPSIS_1N_Pond[x][z] / Math.max.apply(Math, Matriz_TOPSIS_1N_Pond[x]);

            arrayfor.push(Norm2_TOPSIS_2NE);
        }

        array_Norm2_TOPSIS_2NE.push(arrayfor);
    }

    console.log(array_Norm2_TOPSIS_2NE);

    while (count < 2) {
        
        arrayObjetoSomatorio = [];

        for (let i = 0; i < arrayC.length; i++) {
            somaMatrizCriterios = 0;

            for (let j = 0; j < arrayA.length; j++) {
                somaMatrizCriterios += Number(MatrizCriterios[i][j]);
            }
            mediaMatrizCriterios = somaMatrizCriterios / MatrizCriterios.length;

            arrayMediaMatrizCriterios.push(mediaMatrizCriterios);
            arraySomaMatrizCriterios.push(somaMatrizCriterios);

            console.log(arrayMediaMatrizCriterios);
            console.log(arraySomaMatrizCriterios);
        }

        for (let a = 0; a < arrayC.length; a++) {
            // ====================================Normalização da Media ===========================

            let arrayNormaMedia = [];
            let arrayNormaSoma = [];

            for (let k = 0; k < arrayC.length; k++) {
                var arrayforMedia = [];
                var arrayforSoma = [];

                for (let l = 0; l < arrayA.length; l++) {
                    
                    if(count == 0){
                        let norma = matriz[k][l] / squareSUMarray(matriz[k]);
                        normaMedia = norma / arrayMediaMatrizCriterios[k];
                        normaSoma = norma / arraySomaMatrizCriterios[k];
                        
                    }else{
                        normaMedia = array_Norm2_TOPSIS_2NE[k][l] / arrayMediaMatrizCriterios[k];
                        normaSoma = array_Norm2_TOPSIS_2NE[k][l] / arraySomaMatrizCriterios[k];

                    }


                    arrayforMedia.push(normaMedia);
                    arrayforSoma.push(normaSoma);
                }

                arrayNormaMedia.push(arrayforMedia);
                arrayNormaSoma.push(arrayforSoma);
            }

            console.log(arrayNormaMedia);
            console.log(arrayNormaSoma);

            // =============================== Ponderando a normalização ==================

            arrayNormPondSoma = [];
            arrayNormPondMedia = [];

            for (let m = 0; m < arrayC.length; m++) {
                // NormPondSoma = 0
                // NormPondMedia = 0

                arrayforPondMedia = [];
                arrayforPondSoma = [];
                for (let n = 0; n < arrayA.length; n++) {
                    if (storage.getItem("opt_metodo1") == "AD") {
                        PesoMetodo = storage.getItem("Peso_" + arrayC[m]);
                        Number(PesoMetodo);
                        vi = arrayNormaSoma[m][n];
                        xi = arrayNormaMedia[m][n];

                        NormPondSoma = arrayNormaSoma[m][n] * PesoMetodo;
                        NormPondMedia = arrayNormaMedia[m][n] * PesoMetodo;
                    }
                    if (storage.getItem("opt_metodo1") == "SAPEVO") {
                        PesoMetodo = PesosSAPEVO();
                        NormPondSoma = arrayNormaSoma[m][n] * PesoMetodo[m];
                        NormPondMedia = arrayNormaMedia[m][n] * PesoMetodo[m];
                    }
                    if (storage.getItem("opt_metodo1") == "AHP") {
                        PesoMetodo = PesosAHP();
                        NormPondSoma = arrayNormaSoma[m][n] * PesoMetodo[m];
                        NormPondMedia = arrayNormaMedia[m][n] * PesoMetodo[m];
                    }

                    arrayforPondMedia.push(NormPondMedia);
                    arrayforPondSoma.push(NormPondSoma);
                }

                arrayNormPondMedia.push(arrayforPondMedia);
                arrayNormPondSoma.push(arrayforPondSoma);
            }

            // console.log("media",arrayNormPondMedia[a])
            // console.log("soma",arrayNormPondSoma[a])

            let S_ideal_SOMA_1NOR_2NE = 0;
            let S_ideal_MEDIA_1NOR_2NE = 0;

            let S_n_ideal_SOMA_1NOR_2NE = 0;
            let S_n_ideal_MEDIA_1NOR_2NE = 0;

            MinMax_2NE = storage.getItem("MinMax_" + a);

            if (MinMax_2NE === "Max") {
                S_ideal_SOMA_1NOR_2NE = Math.max.apply(Math, arrayNormPondSoma[a]);
                S_n_ideal_SOMA_1NOR_2NE = Math.min.apply(Math, arrayNormPondSoma[a]);

                S_ideal_MEDIA_1NOR_2NE = Math.max.apply(Math, arrayNormPondMedia[a]);
                S_n_ideal_MEDIA_1NOR_2NE = Math.min.apply(Math, arrayNormPondMedia[a]);
            }
            if (MinMax_2NE === "Min") {
                S_ideal_SOMA_1NOR_2NE = Math.min.apply(Math, arrayNormPondSoma[a]);
                S_n_ideal_SOMA_1NOR_2NE = Math.max.apply(Math, arrayNormPondSoma[a]);

                S_ideal_MEDIA_1NOR_2NE = Math.min.apply(Math, arrayNormPondMedia[a]);
                S_n_ideal_MEDIA_1NOR_2NE = Math.max.apply(Math, arrayNormPondMedia[a]);
            }

            // console.log(arrayC[a]+" ideal soma",S_ideal_SOMA_1NOR_2NE)
            // console.log(arrayC[a]+" ideal media",S_ideal_MEDIA_1NOR_2NE)

            // console.log(arrayC[a]+" não ideal soma",S_n_ideal_SOMA_1NOR_2NE)
            // console.log(arrayC[a]+" não ideal media",S_n_ideal_MEDIA_1NOR_2NE)

            // ================================= formula c2 = a2 - b2 ================================

            let formulaC_media = Math.sqrt(Math.abs(S_ideal_MEDIA_1NOR_2NE * S_ideal_MEDIA_1NOR_2NE - S_n_ideal_MEDIA_1NOR_2NE * S_n_ideal_MEDIA_1NOR_2NE));

            let = formulaC_soma = Math.sqrt(Math.abs(S_ideal_SOMA_1NOR_2NE * S_ideal_SOMA_1NOR_2NE - S_n_ideal_SOMA_1NOR_2NE * S_n_ideal_SOMA_1NOR_2NE));

            // console.log(formulaC_media)
            // console.log(formulaC_soma)

            // =============================================== excentricidade eliptica ====================================

            let Ext_Eli_Media = formulaC_media / S_ideal_MEDIA_1NOR_2NE;

            let Ext_Eli_Soma = formulaC_soma / S_ideal_SOMA_1NOR_2NE;

            // ================================= Calc Distancia eliptica =======================================================

            let pi = 3.141592654;

            let Dis_el_Pos_Media = 0;
            let Dis_el_Neg_Media = 0;

            let Dis_el_Pos_Soma = 0;
            let Dis_el_Neg_Soma = 0;

            array_Dis_el_Pos_Media = [];
            array_Dis_el_Neg_Media = [];

            array_Dis_el_Pos_Soma = [];
            array_Dis_el_Neg_Soma = [];

            let Somatorio_Dis_el_Pos_Media = 0;

            let Somatorio_Dis_el_Neg_Media = 0;

            let Somatorio_Dis_el_Pos_Soma = 0;

            let Somatorio_Dis_el_Neg_Soma = 0;

            arraySomatorio_Dis_el_Pos_Media = [];

            arraySomatorio_Dis_el_Neg_Media = [];

            arraySomatorio_Dis_el_Pos_Soma = [];

            arraySomatorio_Dis_el_Neg_Soma = [];

            for (let p = 0; p < arrayA.length; p++) {
                arrayForObjeto = [];

                varNormPond_media = arrayNormPondMedia[a][p];
                varNormPond_soma = arrayNormPondSoma[a][p];

                Dis_el_Pos_Media = pi * (varNormPond_media * S_ideal_MEDIA_1NOR_2NE) * (2 - (Ext_Eli_Media * Ext_Eli_Media) / 2 - (3 * Math.pow(Ext_Eli_Media, 4)) / 32 - (5 * Math.pow(Ext_Eli_Media, 6)) / 128);

                Dis_el_Neg_Media = pi * (varNormPond_media * S_n_ideal_MEDIA_1NOR_2NE) * (2 - (Ext_Eli_Media * Ext_Eli_Media) / 2 - (3 * Math.pow(Ext_Eli_Media, 4)) / 32 - (5 * Math.pow(Ext_Eli_Media, 6)) / 128);

                Dis_el_Pos_Soma = pi * (varNormPond_soma * S_ideal_SOMA_1NOR_2NE) * (2 - (Ext_Eli_Soma * Ext_Eli_Soma) / 2 - (3 * Math.pow(Ext_Eli_Soma, 4)) / 32 - (5 * Math.pow(Ext_Eli_Soma, 6)) / 128);

                Dis_el_Neg_Soma = pi * (varNormPond_soma * S_n_ideal_SOMA_1NOR_2NE) * (2 - (Ext_Eli_Soma * Ext_Eli_Soma) / 2 - (3 * Math.pow(Ext_Eli_Soma, 4)) / 32 - (5 * Math.pow(Ext_Eli_Soma, 6)) / 128);

                array_Dis_el_Pos_Media.push(Dis_el_Pos_Media);
                array_Dis_el_Neg_Media.push(Dis_el_Neg_Media);

                array_Dis_el_Pos_Soma.push(Dis_el_Pos_Soma);
                array_Dis_el_Neg_Soma.push(Dis_el_Neg_Soma);

                objetoSoma = {
                    nome: arrayC[a],
                    DisEl_Pos_Media: array_Dis_el_Pos_Media,
                    DisEl_Neg_Media: array_Dis_el_Neg_Media,
                    DisEl_Pos_Soma: array_Dis_el_Pos_Soma,
                    DisEl_Neg_Soma: array_Dis_el_Neg_Soma,
                };

                // arrayForObjeto.push(objetoSoma)
            }

            arrayObjetoSomatorio.push(objetoSoma);

            console.log(arrayObjetoSomatorio);
        }

        // ================================================== somatorio Distancia eliptica ========================

        arraySomatorio_DisEl_Pos_Media = [];
        arraySomatorio_DisEl_Neg_Media = [];
        arraySomatorio_DisEl_Pos_Soma = [];
        arraySomatorio_DisEl_Neg_Soma = [];

        for (let b = 0; b < arrayA.length; b++) {
            Somatorio_DisEl_Pos_Media = 0;
            Somatorio_DisEl_Neg_Media = 0;
            Somatorio_DisEl_Pos_Soma = 0;
            Somatorio_DisEl_Neg_Soma = 0;

            for (let r = 0; r < arrayC.length; r++) {
                PosMedia = arrayObjetoSomatorio[r].DisEl_Pos_Media[b];
                NegMedia = arrayObjetoSomatorio[r].DisEl_Neg_Media[b];
                PosSoma = arrayObjetoSomatorio[r].DisEl_Pos_Soma[b];
                NegSoma = arrayObjetoSomatorio[r].DisEl_Neg_Soma[b];

                Somatorio_DisEl_Pos_Media += PosMedia;
                Somatorio_DisEl_Neg_Media += NegMedia;
                Somatorio_DisEl_Pos_Soma += PosSoma;
                Somatorio_DisEl_Neg_Soma += NegSoma;
            }

            arraySomatorio_DisEl_Pos_Media.push(Somatorio_DisEl_Pos_Media);
            arraySomatorio_DisEl_Neg_Media.push(Somatorio_DisEl_Neg_Media);
            arraySomatorio_DisEl_Pos_Soma.push(Somatorio_DisEl_Pos_Soma);
            arraySomatorio_DisEl_Neg_Soma.push(Somatorio_DisEl_Neg_Soma);
        }

        console.log(arraySomatorio_DisEl_Pos_Media);
        console.log(arraySomatorio_DisEl_Neg_Media);
        console.log(arraySomatorio_DisEl_Pos_Soma);
        console.log(arraySomatorio_DisEl_Neg_Soma);

        array_E_Soma_ideal = [];
        array_E_Soma_anti_ideal = [];
        array_E_Media_ideal = [];
        array_E_Media_anti_ideal = [];

        for (let s = 0; s < arrayA.length; s++) {
            E_Soma_ideal = arraySomatorio_DisEl_Neg_Soma[s] / (arraySomatorio_DisEl_Neg_Soma[s] + arraySomatorio_DisEl_Pos_Soma[s]);

            E_Soma_anti_ideal = arraySomatorio_DisEl_Pos_Soma[s] / (arraySomatorio_DisEl_Neg_Soma[s] + arraySomatorio_DisEl_Pos_Soma[s]);

            E_Media_ideal = arraySomatorio_DisEl_Neg_Media[s] / (arraySomatorio_DisEl_Pos_Media[s] + arraySomatorio_DisEl_Neg_Media[s]);

            E_Media_anti_ideal = arraySomatorio_DisEl_Pos_Media[s] / (arraySomatorio_DisEl_Pos_Media[s] + arraySomatorio_DisEl_Neg_Media[s]);

            array_E_Soma_ideal.push(E_Soma_ideal);
            array_E_Soma_anti_ideal.push(E_Soma_anti_ideal);
            array_E_Media_ideal.push(E_Media_ideal);
            array_E_Media_anti_ideal.push(E_Media_anti_ideal);



            if(count == 0){
                
                array_E_Soma_ideal_1N.push(E_Soma_ideal);
                array_E_Soma_anti_ideal_1N.push(E_Soma_anti_ideal);
                array_E_Media_ideal_1N.push(E_Media_ideal);
                array_E_Media_anti_ideal_1N.push(E_Media_anti_ideal);
            }else{

                array_E_Soma_ideal_2N.push(E_Soma_ideal);
                array_E_Soma_anti_ideal_2N.push(E_Soma_anti_ideal);
                array_E_Media_ideal_2N.push(E_Media_ideal);
                array_E_Media_anti_ideal_2N.push(E_Media_anti_ideal);
            }

        

        }
        count ++
    }

    
    console.log("soma ideal 1n", array_E_Soma_ideal_1N);
    console.log("soma anti 1n",array_E_Soma_anti_ideal_1N);
 
    console.log("media ideal 1n",array_E_Media_ideal_1N);
    console.log("meida anti 1n",array_E_Media_anti_ideal_1N);
    

   console.log("=====================2N=============================")

   console.log("soma ideal 2n", array_E_Soma_ideal_2N);
   console.log("soma anti 2n",array_E_Soma_anti_ideal_2N);

   console.log("media ideal 2n",array_E_Media_ideal_2N);
   console.log("meida anti 2n",array_E_Media_anti_ideal_2N);

   
    
    
    return [array_E_Soma_ideal_1N, array_E_Soma_anti_ideal_1N, array_E_Media_ideal_1N, array_E_Media_anti_ideal_1N,array_E_Soma_ideal_2N, array_E_Soma_anti_ideal_2N, array_E_Media_ideal_2N, array_E_Media_anti_ideal_2N];

    
}


function MostrarTabela(){

    document.getElementById('tabela_topsis').style="display:flex;background: gainsboro;padding-bottom: 50px;border: 3px solid #000;padding-top: 10px;box-shadow: 10px 10px 10px;margin-bottom: 30px;    ";
    document.getElementById('MostrarTB').innerHTML="Esconder Tabela -";
    document.getElementById('MostrarTB').className="btn btn-danger"
    document.getElementById('MostrarTB').setAttribute("onclick","SumirTabela()");
    // document.getElementById('savePDF').setAttribute("onclick","SaveFullPDF()");
}

function MostrarTabela1N(){

    document.getElementById('1_normalizaçao').style="display:flex;background: gainsboro;padding-bottom: 50px;border: 3px solid #000;padding-top: 10px;box-shadow: 10px 10px 10px;margin-bottom: 30px;   "  
    document.getElementById('MostrarTB1N').innerHTML="Esconder Tabela 1N -";
    document.getElementById('MostrarTB1N').className="btn btn-danger"
    document.getElementById('MostrarTB1N').setAttribute("onclick","SumirTabela1N()");
    // document.getElementById('savePDF').setAttribute("onclick","SaveFullPDF()");

}


// function SumirTabela(){

//     document.getElementById('tabela_topsis').style="overflow-x:auto;display:none;"
//     document.getElementById('MostrarTB').className="btn btn-success"
//     document.getElementById('MostrarTB').innerHTML="Mostrar Tabela +";
//     document.getElementById('MostrarTB').setAttribute("onclick","MostrarTabela()");
 
// }


// function SumirTabela1N(){

//     document.getElementById('1_normalizaçao').style="overflow-x:auto;display:none;"
//     document.getElementById('MostrarTB1N').innerHTML="Mostrar Tabela 1N +";
//     document.getElementById('MostrarTB1N').className="btn btn-success"
//     document.getElementById('MostrarTB1N').setAttribute("onclick","MostrarTabela1N()");
 
// }
