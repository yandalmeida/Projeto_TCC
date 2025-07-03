document.addEventListener("DOMContentLoaded", () => {
    const rawData = document.getElementById("grafico-data").textContent;
    let respostas;

    try {
        respostas = JSON.parse(rawData);
        if (!Array.isArray(respostas)) throw new Error("respostas não é um array");
    } catch (error) {
        console.error("Erro ao processar dados JSON:", error);
        return;
    }

    function contarFrequencia(array) {
        return array.reduce((acc, val) => {
            acc[val] = (acc[val] || 0) + 1;
            return acc;
        }, {});
    }

    const frequencias = contarFrequencia(respostas.map(r => r.frequencia_visita));
    const veganas = contarFrequencia(respostas.map(r => r.prefere_opcao_vegana));
    const alergias = contarFrequencia(respostas.map(r => r.tem_alergia));
    const satisfacao = respostas.map(r => r.satisfacao_geral);

    new Chart(document.getElementById('frequenciaChart'), {
        type: 'bar',
        data: {
            labels: Object.keys(frequencias),
            datasets: [{
                label: 'Frequência de Visitas',
                data: Object.values(frequencias),
                backgroundColor: 'rgba(34,197,94,0.7)'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    precision: 0
                }
            }
        }
    });

    new Chart(document.getElementById('veganaChart'), {
        type: 'doughnut',
        data: {
            labels: Object.keys(veganas),
            datasets: [{
                label: 'Preferência por Opções Veganas',
                data: Object.values(veganas),
                backgroundColor: ['rgba(34,197,94,0.7)', 'rgba(220,38,38,0.7)']
            }]
        },
        options: {
            responsive: true
        }
    });

    new Chart(document.getElementById('alergiaChart'), {
        type: 'pie',
        data: {
            labels: Object.keys(alergias),
            datasets: [{
                label: 'Alergias Alimentares',
                data: Object.values(alergias),
                backgroundColor: ['rgba(244,63,94,0.7)', 'rgba(147,197,253,0.7)']
            }]
        },
        options: {
            responsive: true
        }
    });

    new Chart(document.getElementById('satisfacaoChart'), {
        type: 'line',
        data: {
            labels: satisfacao.map((_, i) => i + 1),
            datasets: [{
                label: 'Satisfação Geral',
                data: satisfacao,
                borderColor: 'rgba(34,197,94,0.8)',
                backgroundColor: 'rgba(34,197,94,0.3)',
                fill: true,
                tension: 0.3,
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    min: 1,
                    max: 5,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
});
