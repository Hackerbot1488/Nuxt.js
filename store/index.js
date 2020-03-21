import socket from "../plugins/socket";

export const state = () => ({
    user: {},
    messages: [],
    users: []
})

export const mutations = {
    setUser(state,user) {
        state.user = user;
    },
    clearData(state){
        state.user = {};
        state.massages = [];
        state.users = [];
        console.log("Clear");
    },
    SOCKET_newMessage(state,message) {
        state.messages.push(message);
    },
    SOCKET_updateUsers(state,users) {
        state.users = users;
    }
}

export const getters ={
    getUser(state) {
        return state.user;
    }
}
/* export const actions = {
    SOCKET_newMessage(ctx,data) {
        console.log('Message received ',data);
    }
    
} */