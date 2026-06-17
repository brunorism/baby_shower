let url = "API_URL";


function renderItems(items) {
    const giftList = document.getElementById('gift-list');
    giftList.innerHTML = '';

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
        let items = JSON.parse(localStorage.getItem('items'));
        if (!items) {
            console.log("[INFO] Calling API...");
            const response = await fetch(url);
            const data = await response.json();
            items = data.giftList;
            console.log(items);
            localStorage.setItem('items', JSON.stringify(items));
        }
        console.log("[INFO] Rendering items...");
        renderItems(items);

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
                location.reload();
            }
        } catch (error) {
            alert(`Erro ao salvar. Tente novamente. (${error})`);
        }
    } else {
        document.getElementById(`gift${id}`).checked = false;
    }
}

getGifts();
