<template>
    <div class="blog-card">
        <div v-show="editPost" class="icons">
            <div @click="editBlog" class="icon">
                <img alt="edit" src="../assets/Icons/edit.png" class="edit">
            </div>
            <div @click="deletePost" class="icon">
                <img alt="delete" src="../assets/Icons/delete.png" class="delete">
            </div>
        </div>
        <img :src="post.blogCoverPhoto" alt="" class="blog-cards-image">
        <!-- <img class="blog-cards-image" :src="require(`../assets/blogCards/${post.blogCoverPhoto}.jpg`)" alt=""> -->
        <div class="info">
            <h4>{{ post.blogTitle }}</h4>
            <h6>Posted on: {{ new Date(post.blogDate).toLocaleDateString('en-us', {dateStyle: 'long'}) }}</h6>
            <router-link :to="{name: 'ViewBlog', params: {blogid: this.post.blogID}}" class="link">View the post<img alt="arrow-right" src="../assets/Icons/arrow-right.png" class="arrow"></router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: "BlogCard",
    props: ["post"],
    methods: {
        deletePost() {
            this.$store.dispatch("deletePost", this.post.blogID);
        },
        editBlog() {
            this.$router.push({name: "EditBlog", params:{blogid: this.post.blogID}});
        }
    },
    computed: {
        editPost() {
            return this.$store.state.editPost;
        }
    }
};
</script>

<style lang="scss" scoped>
.blog-card {
    position: relative;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    background-color: #fff;
    min-height: 420px;
    transition: .5s ease all;

    &:hover {
        transform: rotateZ(-1deg) scale(1.01);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.6);
    }

    .icons {
        display: flex;
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 99;

        .icon {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 35px;
            height: 35px;
            border-radius: 50%;
            background-color: #fff;
            transition: 0.5s ease all;

            &:hover {
                background-color: #303030;

                .edit, .delete{
                    path {
                        fill: #fff;
                    }
                }
            }

            &:nth-child(1) {
                margin-right: 8px;
            }

            .edit, .delete {
                pointer-events: none;
                height: 15px;
                width: auto;
            }
        }
    }

    .blog-cards-image {
        display: block;
        border-radius: 8px 8px 0 0;
        z-index: 1;
        width: 100%;
        min-height: 200px;
        object-fit: cover;
    }

    .info {
        display: flex;
        flex-direction: column;
        height: 100%;
        z-index: 3;
        padding: 32px 16px;
        color: #000;

        h4 {
            padding-bottom: 8px;
            font-size: 20px;
            font-weight: 300;
        }

        h6 {
            font-weight: 400;
            font-size: 12px;
        }

        .link {
            display: inline-flex;
            align-items: center;
            margin-top: auto;
            font-weight: 500;
            padding-top: 20px;
            font-size: 12px;
            padding-bottom: 4px; 
            transition: 0.5s ease all;

            &:hover {
                color: rgba(48, 48, 48, 0.8);
            }

            .arrow {
                width: 10px;
            }
        }
    }
}
</style>