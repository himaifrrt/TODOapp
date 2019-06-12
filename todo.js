let data = [];
let list = $('#list');
const placeholder = $('#plch');
const addBtn = $('.addBtn');
const delButton = $('.delBtn');

const generateId = () => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < 8; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    };
    return result;
};

const addElem = (text = '', status = false) => {
    const id = generateId();
    return data.push({ id, text, status });
};
addBtn.click(event => {
    let text = placeholder.val();
    addElem(text);
    placeholder.val('');
    renderList(data);
});
placeholder.keyup('keyup', function (e) {
    if (e.keyCode === 13) {
        let text = placeholder.val();
        addElem(text);
        placeholder.val('');
        renderList(data);
    };
});

const removeItem = (id) => {
    const itemIndex = data.findIndex(el => el.id === id);
    if (~itemIndex) {
        data.splice(itemIndex, 1);
    }
};
list.on('click', '.delBtn', (event) => {
    const { name } = event.target;
    removeItem(name);
    renderList(data);
});

list.on('click', '.editBtn', (event) => {
    const { name } = event.target;
    const element = $(event.target).parent();
    element.empty();
    let { text } = data.find(el => el.id === name);
    element.append(
        $('<input>', {
            type: 'text',
            val: text,
        })
    );
    element.append(
        $('<input>', {
            type: 'button',
            val: 'Save',
            class: 'saveBtn btn btn-success',
            name
        })
    )
});

list.on('click', '.saveBtn', (event) => {
    const { name } = event.target;
    const element = $(event.target).parent();
    const input = element.find('input[type=text]');
    const text = input.val();
    editItem({ id: name, text });
    renderList(data);
});
let editItem = (params) => {
    let { id, text, status } = params;
    const itemToEdit = data.find(el => el.id === id);
    status = status ? true : false;
    if (itemToEdit) {
        if (text) {
            itemToEdit.text = text;
        }
        itemToEdit.status = status;
    }
};

list.on('click', '.doneBtn', (event) => {
    let { value, name } = event.target;
    value = value === 'true' ? true : false;
    editItem({ id: name, status: !value });
    renderList(data);
});

const renderedItem = itemObject => {
    const { id, text, status } = itemObject;
    const itemClass = (status) => status ? 'done' : 'undone';
    return `<li class=" ${itemClass(status)}">
    <p> ${text} </p>
    <button name="${id}"
        class="doneBtn btn btn-warning"
        value="${status}">
            Mark as ${itemClass(!status)}
    </button>
    <button name="${id}"
        class="editBtn btn btn-info"> 
            Edit
    </button>
    <button name="${id}"
        class="delBtn btn btn-danger"> 
            X
    </button>
    </li>`
};
const renderList = (array) => {
    list.empty();
    list.append(
        array.map(el => {
            return renderedItem(el);
        })
    );
}
