let entries;
let newTempEntry = {
    entry_name: '',
    entry_date: '',
    category_name: '',
    entry_completed: false,
};

function getAllEntries() {
    fetch("https://todolist-9a51.restdb.io/rest/todolist", {
        method: "get",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "x-apikey": "5d8dcab41ce70f6379855087",
            "cache-control": "no-cache"
        }
    })
        .then(e => {
            e.json().then((data) => {
                if(data.length !== 0) {
                    data.forEach((entry) => {
                        addNewEntryToHTML(entry)
                    });
                }
            }).catch(e => console.log(e));
        })
        .catch(e => {
            console.log(e);
            entries = [];
        });
}

function postEntry(entry) {
    const postData = JSON.stringify(entry);
    fetch("https://todolist-9a51.restdb.io/rest/todolist", {
        method: "post",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "x-apikey": "5d8dcab41ce70f6379855087",
            "cache-control": "no-cache"
        },
        body: postData
    })
        .then( (res) => {
            res.json()
                    .then((data) => {
                        addNewEntryToHTML(data);
                    }).catch(e => {
                        console.log(e)
            });

        })
        .catch(e => console.log(e));
}

function updateEntryByID(entry) {
    let postData = JSON.stringify(entry);

    fetch(`https://todolist-9a51.restdb.io/rest/todolist/${entry.entry_id}`, {
        method: "put",
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            "x-apikey": "5d8dcab41ce70f6379855087",
            "cache-control": "no-cache"
        },
        body: postData
    }).then(res => {
        res.json().then((response) => {
            console.table(response)
        }).catch(e => console.log(e));
    }).catch(t => console.log(t));
}
window.onload = () => {
    getAllEntries();

    const entryName = document.getElementById('entryName');
    const entryDate = document.getElementById('entryDate');
    const entryCategory = document.getElementById('entryCategory');
    // Submit button action
    document.getElementById('addEntry').onclick = (e) => {
        e.preventDefault();

        postEntry(newTempEntry);
    };

    entryName.onchange = function() {
        newTempEntry.entry_name = entryName.value;
    };

    entryDate.onchange = function() {
        const formatDate = function(date) {
          const splitedDate = date.split('-');

          return `${splitedDate[2]}/${splitedDate[1]}/${splitedDate[0]}`
        };

        newTempEntry.entry_date = formatDate(entryDate.value);
    };

    entryCategory.onchange = function() {
        newTempEntry.category_name = entryCategory.value;
    };


};


// Name of the entry is too long
function showMessage() {
    const maxLength = document.getElementById('maxLength');
    const message = maxLength.value;

    if(message.length > 18) {
        maxLength.style.display = 'block';
    }
}

function addNewEntryToHTML(entry) {
    const entryTemplate = document.getElementById('entryTemplate');
    const newTempEntry = entryTemplate.content.cloneNode(true);
    const checkBox = newTempEntry.firstElementChild.children[3].firstElementChild;

    newTempEntry.firstElementChild.children[0].textContent = entry.entry_name;
    newTempEntry.firstElementChild.children[1].textContent = entry.entry_date;
    newTempEntry.firstElementChild.children[2].textContent = entry.category_name;
    checkBox.checked = entry.entry_completed;
    checkBox.id = entry['_id'];

    checkBox.onchange = () => {
        markOrUnmarkEntry(checkBox);
    };

    document.getElementById('entriesContainer').appendChild(newTempEntry);
}

function markOrUnmarkEntry(DOMElement) {
    updateEntryByID({
        entry_id: DOMElement.id,
        entry_completed: DOMElement.checked,
    });
}