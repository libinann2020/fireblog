<template>
  <div class="home"></div>
  <BlogPost v-if="!user" :post="welcomeScreen"/>
  <BlogPost :post="post" v-for="(post, index) in blogPostsFeed" :key="index"/>
  <!-- <BlogPost :post="post" v-for="(post, index) in sampleBlogPost" :key="index"/> -->
  <div class="blog-card-wrap">
    <div class="container">
      <h3>View More Recent Blogs</h3>
      <div class="blog-cards">
        <BlogCards :post="post" v-for="(post, index) in blogPostsCards" :key="index" />
        <!-- <BlogCards :post="post" v-for="(post, index) in sampleBlogCards" :key="index" /> -->
      </div>
    </div>
    <div v-if="!user" class="updates">
      <div class="container">
        <h2>never miss a post, Register for your free account today!</h2>
        <router-link to="#" class="router-button">
          Register for FireBlogs <img alt="arrow-right" src="../assets/Icons/white-arrow-right.png" class="arrow arrow-light">
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import BlogPost from '@/components/BlogPost.vue';
import BlogCards from '@/components/BlogCard.vue';
export default {
  name: 'HomeView',
  components: {
    BlogPost, BlogCards
  },
  data() {
    return {
      welcomeScreen: {
        title: "Welcome!",
        blogPost: "Weekly blog articles with all things programming including HTML, CSS & Javascript and more. Register today to never miss a post",
        welcomeScreen: true,
        photo: "coding",
      },
      // sampleBlogPost: [
      //   {
      //     title: "This is a Filler Title!",
      //     blogHTML: "This is a filler blog post title!",
      //     blogCoverPhoto: "beautiful-stories",
      //   },
      //   {
      //     title: "This is a Filler Title!",
      //     blogHTML: "This is a filler blog post title!",
      //     blogCoverPhoto: "designed-for-everyone"
      //   },
      // ],
    };
  },
  computed: {
    // sampleBlogCards() {
    //   return this.$store.state.sampleBlogCards;
    // },
    blogPostsFeed() {
      return this.$store.getters.blogPostsFeed;
    },
    blogPostsCards() {
      return this.$store.getters.blogPostsCards;
    },
    user() {
        return this.$store.state.user;
    } 
  }
}
</script>

<style lang="scss" scoped>
.blog-card-wrap {
  h3 {
    font-weight: 300;
    font-size: 28px;
    margin-bottom: 32px;
  }
}

.updates {
  .container {
    padding: 100px 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
    @media(min-width: 800px) {
      padding: 125px 25px;
      flex-direction: row;
    }

    .arrow {
      width: 30px;
    }

    .router-button {
      display: flex;
      font-size: 14px;
      text-decoration: none;
      @media(min-width:800px){
        margin-left: auto;
      }
    }

    h2 {
      font-weight: 300;
      font-size:32px;
      max-width:425x;
      width: 100%;
      text-align: center;
      text-transform: uppercase;
      @media(min-width: 800px){
        text-align: initial;
        font-size: 40px;
      }
    }
  }
}
</style>