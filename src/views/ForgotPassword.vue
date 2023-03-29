<template>
    <div class="reset-password">
        <ModalVue v-if="modalActive" :modalMessage="modalMessage" v-on:click="closeModal"/>
        <LoadingVue v-if="loading"/>
        <div class="form-wrap">
            <form class="reset">
                <p class="login-register">
                    Back to
                    <router-link class="router-link" :to="{name: 'LoginView'}">Login</router-link>
                </p>
                <h2>Reset Password</h2>
                <p>Forgot your password? Enter your email to reset it</p>
                <div class="inputs">
                    <div class="input">
                        <input type="text" placeholder="Email" v-model="email">
                        <img alt="email" src="../assets/Icons/email.png" class="icon">
                    </div>
                </div>
                <button @click.prevent="resetPassword">Reset</button>
                <div class="angle"></div>
            </form>
            <div class="background"></div>
        </div>
    </div>
</template>

<script>
import ModalVue from "@/components/ModalVue.vue";
import LoadingVue from "@/components/LoadingVue.vue";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
export default {
    name:"ForgotPassword",
    data() {
        return {
            email: "",
            modalActive: false,
            modalMessage: "",
            loading: null
        };
    },
    components: {
        ModalVue,
        LoadingVue
    },
    methods: {
        resetPassword() {
            this.loading = true;
            const auth = getAuth();
            sendPasswordResetEmail(auth, this.email)
            .then(() => {
                this.modalMessage = "If your account exists, you will receive a email";
                this.loading = false;
                this.modalActive = true;
            }).catch(err => {
                console.log(err.code)
                switch(err.code){
                case 'auth/invalid-email':
                    this.modalMessage = "Invalid email";
                    this.loading = false;
                    this.modalActive = true;
                    break
                default:
                    alert("Something went wrong")
                }
            })
        },
        closeModal() {
            this.modalActive = !this.modalActive;
            this.email = "";
        }
    }
};
</script>

<style lang="scss" scoped>
.reset-password {
    position: relative;
    .form-wrap {
        .reset {
            h2 {
                margin-bottom: 8px;
            }
            p{
                text-align: center;
                margin-bottom: 32px;
            }
        }
    }
}

.form-wrap {
    overflow: hidden;
    display: flex;
    height: 100vh;
    justify-content: center;
    align-self: center;
    margin: 0 auto;
    width: 90%;
    @media (min-width: 900px) {
        width: 100%;
    }

    .login-register {
        margin-bottom: 32px;

        .router-link {
            color: #000;
        }
    }

    form {
        padding: 0 10px;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 1;
        @media (min-width: 900px) {
            padding: 0 50px;
        }

        h2 {
            text-align: center;
            font-size: 32px;
            color: #303030;
            margin-bottom: 40px;
            @media(min-width: 900px) {
                font-size: 40px;
            }
        }

        .inputs {
            width: 100%;
            max-width: 350px;
            .input {
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: 8px;
                input {
                    width: 100%;
                    border: none;
                    background-color: #f2f7f6;
                    padding: 4px 4px 4px 30px;
                    height: 50px;

                    &:focus {
                        outline: none;
                    }
                }

                .icon {
                    width: 12px;
                    position: absolute;
                    left: 6px;
                }
            }
        }

        .forgot-password {
            text-decoration: none;
            color: #000;
            cursor:pointer;
            font-size: 14px;
            margin: 16px 0 32px;
            border-bottom: 1px solid transparent;
            transition: 0.5s ease all;

            &:hover {
                border-color: #303030;
            }
        }

        .angle {
            display: none;
            position: absolute;
            background-color: #fff;
            transform: rotateZ(3deg);
            width: 60px;
            right: -30px;
            height: 101%;
            @media(min-width: 900px) {
                display: initial;
            }
        }
    }

    .background {
        display: none;
        flex: 2;
        background-size: cover;
        background-image: url("../assets/background.png");
        width: 100%;
        height: 100%;
        @media (min-width: 900px) {
            display: initial;
        }
    }
}
</style>