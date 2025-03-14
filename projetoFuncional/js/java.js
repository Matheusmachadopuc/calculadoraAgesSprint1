let expressao = "";
let historico = [];

function insertOp(operador) {
    if (expressao.length === 0) return;
    let ultimoCaractere = expressao[expressao.length - 1];

    if ("+-*/%".includes(ultimoCaractere)) {
        expressao = expressao.slice(0, -1);
    }

    if (operador === "x") {
        expressao += "*";
    } else if (operador === "÷") {
        expressao += "/";
    } else if (operador === "%") {
        expressao += "/100";
    } else {
        expressao += operador;
    }

    if (expressao.length > 24) {
        expressao = expressao.slice(0, 24);
    }

    atualizarDisplay(operador);
}

function insert(num) {
    if (expressao.length >= 24) return;

    if (num === ",") {
        let partes = expressao.split(/[\+\-\*\/]/);
        let ultimaParte = partes[partes.length - 1];

        if (ultimaParte.includes(".")) return;

        num = ".";
    }
    expressao += num;
    if (expressao.length > 24) {
        expressao = expressao.slice(0, 24);
    }

    atualizarDisplay();
}

function mudaSinal() {
    if (expressao.length === 0) return;

    let partes = expressao.split(/([\+\-\*\/])/);
    let ultimoIndice = partes.length - 1;
    let ultimoNumero = partes[ultimoIndice];

    if (!ultimoNumero.match(/[0-9]/)) return;

    if (ultimoNumero.startsWith("(-")) {
        partes[ultimoIndice] = ultimoNumero.slice(2, -1);
    } else {
        partes[ultimoIndice] = `(-${ultimoNumero})`;
    }

    expressao = partes.join("");
    atualizarDisplay();
}

function insertImage(imageSrc) {
    document.getElementById("resultado").innerHTML += `<img src="${imageSrc}" width="20px">`;
}

function clean() {
    expressao = "";
    atualizarDisplay();
}

function c() {
    if (expressao.length === 0) return;
    let regexParenteses = /\(-+(\d+(\.\d+)?)\)+$/;

    if (regexParenteses.test(expressao)) {
        expressao = expressao.replace(/\(-+/, "").replace(/\)$/, "");
    } else if (/[+\-*/]$/.test(expressao)) {
        expressao = expressao.slice(0, -1);
    } else {
        expressao = expressao.slice(0, -1);
    }

    atualizarDisplay();
}

let ultimaExpressao = "";

function calcular() {
    try {
        let expressaoCalculo = expressao.replace(/x/g, "*").replace(/÷/g, "/");
        expressaoCalculo = expressaoCalculo
            .replace(/sin\(/g, 'Math.sin(')
            .replace(/cos\(/g, 'Math.cos(')
            .replace(/tan\(/g, 'Math.tan(')
            .replace(/log\(/g, 'Math.log10(')
            .replace(/ln\(/g, 'Math.log(')
            .replace(/sqrt\(/g, 'Math.sqrt(')
            .replace(/exp\(/g, 'Math.exp(')
            .replace(/pi/g, 'Math.PI')
            .replace(/e/g, 'Math.E')
            .replace(/\^/g, '**')
            .replace(/abs\(/g, 'Math.abs(')
            .replace(/pow\(/g, 'Math.pow(')
            .replace(/factorial\(/g, 'factorial(');

        function factorial(n) {
            if (n === 0 || n === 1) {
                return 1;
            }
            let result = 1;
            for (let i = 2; i <= n; i++) {
                result *= i;
            }
            return result;
        }

        let resultado = eval(expressaoCalculo);

        historico.push({ expressao: expressao, resultado: resultado });

        ultimaExpressao = expressao;
        expressao = resultado.toString();
        atualizarDisplay();
    } catch (error) {
        document.getElementById("resultado").innerHTML = "Erro";
        expressao = "";
    }
}

function atualizarDisplay(operador) {
    if (operador === "%") {
        document.getElementById("resultado").innerHTML = expressao.replace(/\/100/g, "%");
    } else if (operador === ";") {
        document.getElementById("resultado").innerHTML = expressao.replace(/\;/g, ".");
    } else {
        document.getElementById("resultado").innerHTML = expressao
            .replace(/\*/g, "x")
            .replace(/\//g, "÷")
            .replace(/\./g, ",");
    }

    document.getElementById("after").innerHTML = ultimaExpressao
        .replace(/\*/g, "x")
        .replace(/\//g, "÷")
        .replace(/\./g, ",");

    let resultadoElement = document.getElementById("resultado");
    if (expressao.length >= 16) {
        resultadoElement.style.fontSize = "20px";
    } else {
        resultadoElement.style.fontSize = "30px";
    }
}

document.getElementById("temaBtn").addEventListener("click", function () {
    document.body.classList.toggle("tema-claro");
});

document.getElementById("historicoBtn").addEventListener("click", function () {
    let historicoDisplay = document.createElement("div");
    historicoDisplay.classList.add("historico");

    if (historico.length === 0) {
        historicoDisplay.innerHTML = "<p>Não há operações no histórico.</p>";
    } else {
        historico.forEach((item) => {
            historicoDisplay.innerHTML += `<p>${item.expressao} = ${item.resultado}</p>`;
        });
    }

    let fecharBtn = document.createElement("button");
    fecharBtn.textContent = "Fechar Histórico";
    fecharBtn.style.marginTop = "10px";
    fecharBtn.addEventListener("click", function () {
        historicoDisplay.remove();
    });
    historicoDisplay.appendChild(fecharBtn);
    document.body.appendChild(historicoDisplay);
});