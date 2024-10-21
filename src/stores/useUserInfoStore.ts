import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserInfoStore = defineStore('userInfo', () => {
    const token = ref<string>('');
    const username = ref<string>('');
    const avatar = ref<string>('');

    function setToken(newToken: string) {
        token.value = newToken;
    }

    function setStudentname(newUsername: string) {
        username.value = newUsername;
    }

    function setAvatar(newAvatar: string) {
        avatar.value = newAvatar;
    }

    function remove() {
        token.value = '';
        username.value = '';
        avatar.value = '';
    }

    return { token, username, avatar, setToken, setStudentname, setAvatar, remove }

},
    {
        persist: true
    }
)