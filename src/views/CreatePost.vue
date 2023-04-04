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
                <!-- <quill-editor v-model:value="blogHTML"  @input="updateContent" /> -->
                <!-- <quill-editor v-model="blogHTML" ref="quill" :options="editorSettings" /> -->
                <quill-editor v-model:content="blogHTML" contentType="html" ref="quill" :toolbar="toolbar" :options="editorSettings" :use-custom-image-handler="true"  @image-added="handleImageAdded"></quill-editor>
                <!-- <QuillEditor theme="snow" v-model="blogHTML"/> -->
                <!-- <vueEditor :editorOptions="editorSettings"></vueEditor> -->
            </div>
            <div class="blog-actions">
                <button @click="uploadBlog">Publish Blog</button>
                <router-link class="router-button" :to="{name: 'BlogPreview'}">Post Preview</router-link>
            </div>
        </div>
    </div>
</template>

<script>
import BlogCoverPreview from '@/components/BlogCoverPreview.vue';
import LoadingVue from '@/components/LoadingVue.vue';
// import { getStorage } from "firebase/storage";
// import { getStorage, ref as firebaseRef, uploadBytes } from 'firebase/storage';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from "../firebase/firebaseInit";
import { doc, collection, setDoc } from "firebase/firestore";
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import Quill from "quill";
window.Quill = Quill;
const ImageResize = require("quill-image-resize-module").default;
Quill.register("modules/imageResize", ImageResize);
// import BlotFormatter from 'quill-blot-formatter'
// import Quill from 'quill';
// const ImageResize = require("quill-image-resize-module").default;
// Quill.register('modules/imageResize', ImageResize);  

export default {
    name: 'CreatePost',
    components: {
        QuillEditor,
        BlogCoverPreview,
        LoadingVue
    },
    data() {
        return {
            file: null,
            quill: null,
            loading:null,
            // modules: {
            //     module: BlotFormatter,
            // },
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
        // imageHandler(file, callback) {
        // imageHandler(file, Editor, cursorLocation, resetUploader) {
            // console.log(file.name)
            // const storageRef = getStorage().ref();
            // const docRef = storageRef.child(`documents/blogPostPhotos/${file.name}`);
            //     docRef.put(file).on("state_changed",(snapshot)=>{
            //         console.log(snapshot);
            // }, (err) => {
            //     console.log(err);
            // }, async () => {
            //     const downloadURL = await docRef.getDownloadURL();
            //     Editor.insertEmbed(cursorLocation, "image", downloadURL);
            //     resetUploader();
            // })

            // const storage = getStorage();
            // const fileRef = ref(storage, `documents/BlogPostPhotos/${file.name}`);
            // uploadBytes(fileRef, file).then(() => {
            //     // Get the public URL of the uploaded image
            //     fileRef.getDownloadURL().then((url) => {
            //     // Insert the image URL into the editor
            //     const range = this.$refs.quill.getSelection();
            //     this.$refs.quill.insertEmbed(range.index, 'image', url);
            //     callback(url);
            //     });
            // });
// console.log(file)
//             const storage = getStorage();
//             const docRef = ref(storage, `documents/BlogPostPhotos/${file.name}`);
//             uploadBytes(docRef, file).then(async (snapshot) => {
//                 console.log(snapshot);
//                 const downloadURL = await getDownloadURL(docRef);
//                 Editor.insertEmbed(cursorLocation, "image", downloadURL);
//                 resetUploader();
//             }, (err) => {
//                 console.log(err);
//             }, async () => {
                // const downloadURL = await getDownloadURL(docRef);
                // Editor.insertEmbed(cursorLocation, "image", downloadURL);
                // resetUploader();
            // });
            // imageHandler(file, callback) {
            //     console.log(file)
            //     console.log('cvhg')
            //     const storage = getStorage();
            //     const docRef = ref(storage, `documents/BlogPostPhotos/${file.name}`);
            //     uploadBytes(docRef, file).then(async (snapshot) => {
            //         console.log(snapshot);
            //         const downloadURL = await getDownloadURL(docRef);
            //         callback(downloadURL);
            //     }, (err) => {
            //         console.log(err);
            //     });
            // },
        handleImageAdded(file, quill) {
            const storageRef = ref(getStorage(), `documents/BlogPostPhotos/${file.name}`);
            uploadBytes(storageRef, file).then((snapshot) => {
                snapshot.ref.getDownloadURL().then((downloadURL) => {
                const range = quill.getSelection(true);
                quill.insertEmbed(range.index, 'image', downloadURL);
                });
            });
        },
        uploadBlog() {
            if(this.blogTitle.length !== 0 && this.blogHTML.length !== 0) {
                if(this.file) {
                    this.loading = true;
                    const storage = getStorage();
                    const docRef = ref(storage, `documents/BlogCoverPhotos/${this.$store.state.blogPhotoName}`);
                    uploadBytes(docRef, this.file).then(async (snapshot) => {
                        console.log(snapshot);
                        const downloadURL = await getDownloadURL(docRef);
                        const timestamp = await Date.now();
                        const dataBase = await doc(collection(db, 'blogPosts'));
                        await setDoc(dataBase, {
                            blogID: dataBase.id,
                            blogHTML: this.blogHTML,
                            blogCoverPhoto: downloadURL,
                            blogCoverPhotoName: this.blogCoverPhotoName,
                            blogTitle: this.blogTitle,
                            profileID: this.profileId,
                            date: timestamp,
                        });
                        await this.$store.dispatch("getPost");
                        this.loading = false;
                        this.$router.push({ name: "ViewBlog", params: {blogid: dataBase.id} });
                    },
                    (err) => {
                        //
                        console.log(err)
                        this.loading = false;
                    }, 
                    async () => {
                        // console.log(dataBase.id)
                        // console.log(this.blogHTML)
                        // console.log(downloadURL)
                        // console.log(this.blogCoverPhotoName)
                        // console.log(this.blogTitle)
                        // console.log(this.profileId)
                        // console.log(timestamp)
                        // const downloadURL = await getDownloadURL(docRef);
                        // const timestamp = await Date.now();
                        // const dataBase = await doc(collection(db, 'blogPosts'));
                        // await setDoc(dataBase, {
                        //     blogID: dataBase.id,
                        //     blogHTML: this.blogHTML,
                        //     blogCoverPhoto: downloadURL,
                        //     blogCoverPhotoName: this.blogCoverPhotoName,
                        //     blogTitle: this.blogTitle,
                        //     profileID: this.profileId,
                        //     date:timestamp,
                        // });
                        // this.$router.push({name: "ViewBlog"});
                        // return;
                    });
                    // docRef.put(this.file).on("state_changed", (snapshot) => {
                    //     console.log(snapshot)
                    // });
                    return;
                } else {
                    this.error = true;
                    this.errorMsg = "Please ensure you uploaded a cover photo!";
                    setTimeout(() => {
                        this.error = false;
                    }, 5000);
                    return;
                }
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