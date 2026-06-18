let url = "API_URL";
let items = { 
    gifts:     JSON.parse(localStorage.getItem('items'))?.gifts,
    timestamp: JSON.parse(localStorage.getItem('items'))?.timestamp
};

function renderItems(items) {
    const giftList = document.getElementById('gift-list');
    giftList.innerHTML = '';

    console.log("[INFO] Rendering items...");
    items.forEach(gift => {
        const isClaimed = gift.taken === 1;

        // Create the HTML structure for each row
        const listItem = document.createElement('li');
        listItem.style.listStyle = 'none';
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
}

async function getGifts() {
    try {
        console.log("[INFO] Calling API...");
        const response = await fetch(url);
        const data = await response.json();
        items.gifts = data.giftList;
        items.timestamp = Date.now();
        localStorage.setItem('items', JSON.stringify(items));

        renderItems(items.gifts);
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

            const response = await fetch(updateUrl, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                alert('Obrigado! O item foi marcado na lista.');
                localStorage.removeItem('items');
                location.reload();
            }
        } catch (error) {
            alert(`Erro ao salvar. Tente novamente. (${error})`);
        }
    } else {
        document.getElementById(`gift${id}`).checked = false;
    }
}

function main() {
    let timeLimit = 60 * 30 * 1000;

    if (!items.gifts) {
        getGifts();
    } else if ((Date.now() - items.timestamp)/1000 >= timeLimit) {
        localStorage.remove('items')
        getGifts();
    } else {
        renderItems(items.gifts);
    }
}

main();
