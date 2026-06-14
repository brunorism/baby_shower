let url = 'https://api.sheety.co/201604539b99b313863730ba6d4aa7c2/babyShower/giftList';

async function getGifts() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        const giftList = document.getElementById('gift-list');
        
        console.log(data);
        // Clear the "Loading" message
        giftList.innerHTML = '';

        // Sheety usually wraps data in a key named after your sheet (e.g., data.folha1)
        // Adjust 'data.gifts' to match your Sheety endpoint's output
        const items = data[Object.keys(data)[0]];

        items.forEach(gift => {
            const isClaimed = gift.taken === 1;
            
            console.log(`${gift.name} is taken: ${isClaimed}`);
            // Create the HTML structure for each row
            const listItem = document.createElement('li');
            listItem.style.listStyle = 'none'; // Keeps it clean
            listItem.innerHTML = `
                <input type="checkbox" 
                       id="gift${gift.id}" 
                       value="${gift.id}" 
                       ${isClaimed ? 'checked disabled' : ''} 
                       onclick="confirmClaim(${gift.id}, '${gift.name}')">
                <label for="gift${gift.id}" style="${isClaimed ? 'text-decoration: line-through; color: gray;' : ''}">
                    ${gift.name} ${isClaimed ? '(Ja escolhido)' : ''}
                </label>
                <br>
            `;
            giftList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Erro ao carregar presentes:', error);
    }
}

async function confirmClaim(id, name) {
    const confirmation = confirm(`O presente escolhido foi: "${name}"?`);
    
    if (confirmation) {
        try {
            const updateUrl = `${url}/${id}`;
            const body = {
                "giftlist": {
                    "taken": 1,
                }
            };

            console.log(JSON.stringify(body));
            const response = await fetch(updateUrl, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                alert('Obrigado! O item foi marcado na lista.');
                location.reload(); // Refresh to show it as disabled
            }
        } catch (error) {
            alert(`Erro ao salvar. Tente novamente. (${error})`);
        }
    } else {
        // Uncheck the box if they click "Cancel"
        document.getElementById(`gift${id}`).checked = false;
    }
}

// Start the process
getGifts();
