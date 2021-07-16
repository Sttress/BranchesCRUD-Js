class Usuario{
    constructor(nome, sobrenome, idade, email, estado, ramal){
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.idade = idade;
        this.email = email;
        this.estado = estado;
        this.ramal = ramal;
    }

    validation(){
        for(let i in this){
            if(this[i] == undefined || this[i] == null || this[i] == ''){
                return false;
            }else{
                return true;
            }
        }
    }
}

createObject=()=>{

    let nome = document.getElementById('nome');
    let sobrenome = document.getElementById('sobrenome');
    let idade = document.getElementById('idade');
    let email = document.getElementById('email');
    let estado = document.getElementById('estado');
    let ramal = document.getElementById('ramal');

    let usuario = new Usuario(
        nome.value,
        sobrenome.value,
        idade.value,
        email.value,
        estado.value,
        ramal.value
    );

    if(usuario.validation()){

        document.getElementById('modal-title').className = 'modal-title text-success';
        document.getElementById('modal-title').innerHTML = 'Sucesso ao criar o usuário';

        document.getElementById('modal-body').innerHTML = 'Usuário foi criado com sucesso';

        document.getElementById('modal-footer').className = 'btn btn-success';
        $('#createUser').modal('show');
        
        nome.value = '';
        sobrenome.value = '';
        idade.value = '';
        email.value = '';
        estado.value = '';
        ramal.value = '';    

        bd.record(usuario);
    }else{

        document.getElementById('modal-title').className = 'modal-title text-danger';
        document.getElementById('modal-title').innerHTML = 'Falha ao criar o usuário';

        document.getElementById('modal-body').innerHTML = 
        '<p>Não foi possivel criar novo usuário, verifique os seguintes requisitos:</p><hr><li class="list-group"><ul class="list-group-item">Campos totalmente preenchidos</ul></li>';

        document.getElementById('modal-footer').className = 'btn btn-danger';
        $('#createUser').modal('show');
    }
}
loadListUsers = ()=>{

    let users = Array();
    users = bd.getFullUsers();
    ListUsers(users);
}

search = () =>{

    let searchInput = document.getElementById('searchUser').value;
    let listUsersSearch = Array();
    listUsersSearch = bd.searchUsersOfInput(searchInput);
    let loadListUsers = document.getElementById('loadListUsers');
    loadListUsers.innerHTML = '';
    ListUsers(listUsersSearch);
}
ListUsers = (u)=>{

    u.forEach(function(u){

        let loadListUsers = document.getElementById('loadListUsers');
        let line = loadListUsers.insertRow()

        line.insertCell(0).innerHTML = u.nome;
        line.insertCell(1).innerHTML = u.email;
        line.insertCell(2).innerHTML = u.estado;
        line.insertCell(3).innerHTML = u.ramal;

        let btnUpdate = document.createElement('button');
        btnUpdate.className = 'btn btn-primary mr-2';
        btnUpdate.innerHTML = '<i class="fas fa-pen"></i>';
        btnUpdate.id = 'btnUpdate'+ u.id;
        let btnDeleted = document.createElement('button');
        btnDeleted.className = 'btn btn-danger';
        btnDeleted.innerHTML = '<i class="fas fa-trash-alt"></i>' 
        btnDeleted.id = 'btnDeleted'+ u.id;  
        btnUpdate.onclick = function(){ 
            let id = this.id.replace('btnUpdate');
            $('#updateUser').modal('show');
            document.getElementById('nomeUpdate').value = u.nome;
            document.getElementById('sobrenomeUpdate').value = u.sobrenome;
            document.getElementById('idadeUpdate').value = u.idade;
            document.getElementById('emailUpdate').value = u.email;
            document.getElementById('estadoUpdate').value = u.estado;
            document.getElementById('ramalUpdate').value = u.ramal;
            document.getElementById('save').id = 'save' + u.id;
        }
        btnDeleted.onclick = function(){
            let id = this.id.replace('btnDeleted','');
            bd.deleted(id);
            window.location.reload();
            
        }
        line.insertCell(4).append(btnUpdate,btnDeleted);
    })

}
saveUpdate = ()=>{

    let btnUpdate = document.querySelectorAll('[id*=save]');
    btnUpdate = btnUpdate[0];
    let id = btnUpdate.id;
    id = id.replace('save',''); 

    let nomeUpdate = document.getElementById('nomeUpdate');
    let sobrenomeUpdate = document.getElementById('sobrenomeUpdate');
    let idadeUpdate = document.getElementById('idadeUpdate');
    let emailUpdate = document.getElementById('emailUpdate');
    let estadoUpdate = document.getElementById('estadoUpdate');
    let ramalUpdate = document.getElementById('ramalUpdate');

    let usuarioUpdate = new Usuario(
        nomeUpdate.value,
        sobrenomeUpdate.value,
        idadeUpdate.value,
        emailUpdate.value,
        estadoUpdate.value,
        ramalUpdate.value
    );
    
    bd.update(id,usuarioUpdate);
    
    btnUpdate.id = 'save';  
}
class Bd{

    constructor(){

        let id = localStorage.getItem('id');

        if(id == null || id == undefined || id == ''){
            localStorage.setItem('id',0);
        }
    }

    record=(u)=>{
        let id = this.getNextId();
        localStorage.setItem(id,JSON.stringify(u));
        localStorage.setItem('id',id);
    }

    getNextId(){
        let getNextId = localStorage.getItem('id');
        return parseInt(getNextId)+1;
    }

    getFullUsers(){
        let id = localStorage.getItem('id')
        let users = Array();
        for(let i = 1; i <= id; i++){
            
            let user = JSON.parse(localStorage.getItem(i));

            if(user == null){
                continue;
            }
            users[i]= user;
            users[i].id = i;
        }
        return users;
    }

    searchUsersOfInput(s){
        
        let usersBd = Array();
        let usersFiltered = Array();
        let cont = 0;
        usersBd = this.getFullUsers();

        for(let i = 1; i < usersBd.length; i++){

            if(usersBd[i].nome == s){
                usersFiltered[cont] = usersBd[i];
                cont ++;
            }else if( usersBd[i].sobrenome == s){
                usersFiltered[cont] = usersBd[i];
                cont ++;
            }else if(usersBd[i].email == s){
                usersFiltered[cont] = usersBd[i];
                cont ++;
            }else if(usersBd[i].ramal == s){
                usersFiltered[cont] = usersBd[i];
                cont ++;
            }
        }

        return usersFiltered;
    }

    update (id,u){

        localStorage.setItem(id,JSON.stringify(u));
    }

    deleted(id){
        localStorage.removeItem(id);
    }
        
}
let bd = new Bd();

regulateId=()=>{

    let btnUpdate = document.querySelectorAll('[id*=save]');
    btnUpdate = btnUpdate[0];
    btnUpdate.id = 'save';
}
