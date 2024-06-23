function calculateBMI(event) {
    event.preventDefault();
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);

    if (height > 0 && weight > 0) {
        const bmi = (weight / ((height / 100) ** 2)).toFixed(2);
        let category = '';

        if (bmi < 18.5) {
            category = 'Underweight';
        } else if (bmi >= 18.5 && bmi < 24.9) {
            category = 'Normal weight';
        } else if (bmi >= 25 && bmi < 29.9) {
            category = 'Overweight';
        } else {
            category = 'Obese';
        }

        document.getElementById('current-bmi').innerText = bmi;
        document.getElementById('bmi-category').innerText = category;

        document.getElementById('step-2').style.display = 'block';
    } else {
        alert('Please enter valid height and weight values.');
    }
}

function calculateIdealWeight() {
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const idealBmi = parseFloat(document.getElementById('ideal-bmi').value);

    if (idealBmi > 0) {
        const idealWeight = ((idealBmi * (height / 100) ** 2)).toFixed(2);

        document.getElementById('ideal-weight').innerText = idealWeight;
        
        const delta = document.getElementById("delta");
        const deltaVal = (weight - idealWeight).toFixed(2);
        if (deltaVal > 0) {
            delta.innerHTML = `lose ${deltaVal}`;
        } else if (deltaVal < 0) {
            delta.innerHTML = `gain ${deltaVal}`;
        } else {
            delta.innerHTML = 'You are at your ideal weight';
        }

        document.getElementById('step-3').style.display = 'block';
    } else {
        alert('Please enter a valid ideal BMI.');
    }
}

document.getElementById('bmi-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const bmi = parseFloat(document.getElementById('current-bmi').innerText);
    const idealBmi = parseFloat(document.getElementById('ideal-bmi').value);
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const timeframe = parseFloat(document.getElementById('timeframe').value);
    const focus = document.getElementById('focus').value;
    
    const idealWeight = parseFloat(document.getElementById('ideal-weight').innerText);
    const weightDifference = (weight - idealWeight).toFixed(2);
    const weeklyChange = (weightDifference / timeframe).toFixed(2);

    try {
        const response = await fetch('http://localhost:3000/get-recommendation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bmi, idealBmi, height, weight, timeframe, focus, weeklyChange })
        });

        const data = await response.text();

        if (data) {
            document.getElementById('result').style.display = 'block';
            document.getElementById('recommendations').innerHTML = data;
        } else {
            alert('Error: ' + data.error);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});
