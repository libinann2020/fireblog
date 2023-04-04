<template>
    <div class="create-post">
        <BlogCoverPreview v-show="this.$store.state.blogPhotoPreview"/>
        <LoadingVue v-show="loading"/>
        <div class="container">
            <div :class="{invisible: !error}" class="err-message">
                <p><span>Error:</span>{{ this.errorMsg }}</p>
            </div>
            <div class="blog-info">
                <input type="text" placeholder="Enter Blog title" v-model="blogTitle" />
                <div class="upload-file">
                    <label for="blog-photo">Upload Cover Photo</label>
                    <input type="file" ref="blogPhoto" id="blog-photo" @change="fileChange" accept=".png,.jpg,.jpeg">
                    <button @click="openPreview" class="preview" :class="{'button-inactive': !this.$store.state.blogPhotoFileURL}">Preview Photo</button>
                    <span>File Choosen: {{ this.$store.state.blogPhotoName }}</span>
                </div>
            </div>
            <div class="editor">
                <quill-editor v-model:content="blogHTML" contentType="html" ref="quill" :toolbar="toolbar" :options="editorSettings" :use-custom-image-handler="true"  @image-added="handleImageAdded"></quill-editor>
            </div>
            <div class="blog-actions">
                <button @click="updateBlog">Save Changes</button>
                <router-link class="router-button" :to="{name: 'BlogPreview'}">Preview Changes</router-link>
            </div>
        </div>
    </div>
</template>

<script>
import BlogCoverPreview from '@/components/BlogCoverPreview.vue';
import LoadingVue from '@/components/LoadingVue.vue';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from "../firebase/firebaseInit";
import { doc, collection, updateDoc } from "firebase/firestore";
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import Quill from "quill";
window.Quill = Quill;
const ImageResize = require("quill-image-resize-module").default;
Quill.register("modules/imageResize", ImageResize);

export default {
    name: 'CreatePost',
    data() {
        return {
            file: null,
            quill: null,
            loading:null,
            routeID: null,
            currentBlog:null,
            toolbar: [
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                [{ size: ['small', false, 'large', 'huge'] }],
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ align: [] }],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ color: [] }, { background: [] }],
                [{ font: [] }],
                ['link', 'image', 'video'],
                ['clean'],
            ],
            error: null,
            errorMsg: null,
            editorSettings: {
                theme: 'snow',
                modules: {
                    imageResize: {},
                }
            }
        }
    },
    components: {
        QuillEditor,
        BlogCoverPreview,
        LoadingVue
    },
    async mounted() {
        this.routeID = this.$route.params.blogid;
        this.currentBlog = await this.$store.state.blogPosts.filter(post => {
            return post.blogID === this.routeID;
        });
        this.$store.commit('setBlogState', this.currentBlog[0]);
    },
    methods: {
        fileChange() {
            this.file = this.$refs.blogPhoto.files[0];
            const fileName = this.file.name;
            this.$store.commit("fileNameChange", fileName);
            this.$store.commit("createFileURL", URL.createObjectURL(this.file));
        },
        openPreview() {
            this.$store.commit("openPhotoPreview");
        },
        handleImageAdded(file, quill) {
            const storageRef = ref(getStorage(), `documents/BlogPostPhotos/${file.name}`);
            uploadBytes(storageRef, file).then((snapshot) => {
                snapshot.ref.getDownloadURL().then((downloadURL) => {
                const range = quill.getSelection(true);
                quill.insertEmbed(range.index, 'image', downloadURL);
                });
            });
        },
        async updateBlog() {
            const dataBase = await doc(collection(db, 'blogPosts'), this.routeID);
            if(this.blogTitle.length !== 0 && this.blogHTML.length !== 0) {
                if(this.file) {
                    this.loading = true;
                    const storage = getStorage();
                    const docRef = ref(storage, `documents/BlogCoverPhotos/${this.$store.state.blogPhotoName}`);
                    uploadBytes(docRef, this.file).then(async (snapshot) => {
                        console.log(snapshot);
                        const downloadURL = await getDownloadURL(docRef);
                
                        await updateDoc(dataBase, {
                            blogHTML: this.blogHTML,
                            blogCoverPhoto: downloadURL,
                            blogCoverPhotoName: this.blogCoverPhotoName,
                            blogTitle: this.blogTitle,
                        });
                        await this.$store.dispatch("updatePost", this.routeID);
                        this.loading = false;
                        this.$router.push({ name: "ViewBlog", params: {blogid: dataBase.id} });
                    },
                    (err) => {
                        //
                        console.log(err)
                        this.loading = false;
                    }, 
                    async () => {
                    });
                } 
                this.loading = true;
                await updateDoc(dataBase, {
                    blogHTML: this.blogHTML,
                    blogTitle: this.blogTitle,
                });
                await this.$store.dispatch("updatePost", this.routeID);
                this.loading = false;
                this.$router.push({name:"ViewBlog", params: {blogid: dataBase.id}})
                return;
            }
            this.error = true;
            this.errorMsg = "Please ensure Blog Title & BLog Post has been filled!";
            setTimeout(() => {
                this.error = false;
            }, 5000);
            return;
        }
    },
    computed: {
        profileId() {
            return this.$store.state.profileId;
        },
        blogCoverPhotoName() {
            return this.$store.state.blogPhotoName;
        },
        blogTitle: {
            get() {
                return this.$store.state.blogTitle;
            },
            set(payload) {
                this.$store.commit("updateBlogTitle", payload);
            },
        },
        blogHTML: {
            get() {
                return this.$store.state.blogHTML;
            },
            set(payload) {
                this.$store.commit("newBlogPost", payload);
            },
        },
    }, 
};
</script>

<style lang="scss" scoped>
.create-post {
    position: relative;
    height: 100%;

    button {
        margin-top: 0;
    }

    .router-button {
        text-decoration: none;
        color: #fff;
    }

    label,
    button,
    .router-button {
        transition: 500ms ease-in-out all;
        align-self: center;
        font-size: 14px;
        cursor: pointer;
        border-radius: 20px;
        padding: 12px 24px;
        color: #fff;
        background-color: #303030;
        text-decoration: none;

        &:hover {
            background-color: rgba(48, 48, 48, 0.7);
        }
    }

    .container {
        position: relative;
        height: 100%;
        padding: 10px 25px 60px;
    }

    // error styling
    .invisible {
        opacity: 0 !important;
    }

    .err-message {
        width: 100%;
        padding: 12px;
        border-radius: 8px;
        color: #fff;
        margin-bottom: 10px;
        background-color: #303030;
        opacity: 1;
        transition: 0.5s ease all;

        p{
            font-size: 14px;
        }

        span {
            font-weight: 600;
        }
    }

    .blog-info {
        display: flex;
        margin-bottom: 32px;

        input:nth-child(1){
            min-width: 300px;
        }

        input {
            transition: .5s ease all;
            padding: 10px 4px ;
            border: none;
            border-bottom: 1px solid #303030;

            &:focus {
                outline: none;
                box-shadow: 0 1px 0 0 #303030;
            }
        }
        .upload-file {
            flex: 1;
            margin-left: 16px;
            position: relative;
            display: flex;

            input{
                display: none;
            }

            .preview {
                margin-left: 16px;
                text-transform: initial;
            }

            span {
                font-size: 12px;
                margin-left: 16px;
                align-self: center;
            }
        }
    }

    .editor {
        height: 60vh;
        display: flex;
        flex-direction: column;

        .quillWrapper {
            position: relative;
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        .ql-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            overflow: scroll;
        }

        .ql-editor {
            padding: 20px 16px 30px;
        }
    }

    .blog-actions {
        margin-top: 32px;

        button: {
            margin-right: 16px;
        }
    }
}
</style>