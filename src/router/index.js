import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ForgotPassword from '../views/ForgotPassword.vue'
import ProfileVue from '../views/ProfileVue.vue'
import AdminVue from '../views/AdminVue.vue'
import CreatePost from '../views/CreatePost.vue'
import BlogPreview from '../views/BlogPreview.vue'
import ViewBlog from '../views/ViewBlog.vue'
import EditBlog from '../views/EditBlog.vue'
import { getAuth, getIdTokenResult } from "firebase/auth";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: {
      title: 'Home',
      requiresAuth: false
    }
  },
  {
    path: '/blogs',
    name: 'BlogsView',
    component: () => import('../views/BlogsView.vue'),
    meta: {
      title: 'Blogs',
      requiresAuth: false
    }
  },
  {
    path: '/login',
    name: 'LoginView',
    component: LoginView,
    meta: {
      title: 'Login',
      requiresAuth: false
    }
  },
  {
    path: '/register',
    name: 'RegisterView',
    component: RegisterView,
    meta: {
      title: 'Register',
      requiresAuth: false
    }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
    meta: {
      title: 'Forgot Password',
      requiresAuth: false
    }
  },
  {
    path: '/profile',
    name: 'ProfileVue',
    component: ProfileVue,
    meta: {
      title: 'Profile',
      requiresAuth: true
    }
  },
  {
    path: '/admin',
    name: 'AdminVue',
    component: AdminVue,
    meta: {
      title: 'Admin',
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/create-post',
    name: 'CreatePost',
    component: CreatePost,
    meta: {
      title: 'Create Post',
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/post-preview',
    name: 'BlogPreview',
    component: BlogPreview,
    meta: {
      title: 'Preview Blog Post',
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/view-blog:blogid',
    name: 'ViewBlog',
    component: ViewBlog,
    meta: {
      title: 'View Blog Post',
      requiresAuth: false,
    }
  },
  {
    path: '/edit-blog:blogid',
    name: 'EditBlog',
    component: EditBlog,
    meta: {
      title: 'Edit Blog Post',
      requiresAuth: true,
      requiresAdmin: true
    }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | FireBlog`
  next();
})

// router.beforeEach((to, from, next) => {
//   let user = getAuth().currentUser;
//   let admin = null;
//   if(user){
//     let token = getIdTokenResult(user);
//     admin = token.claims.admin;
//   }
//   if(to.matched.some((res) => res.meta.requiresAuth)) {
//     if(user){
//       if(to.matched.some((res) => res.meta.requiresAdmin)) {
//         if(admin) {
//           return next()
//         }
//         return next({name: "Home"});
//       }
//       return next();
//     }
//   }
//   return next({name: "Home"});
// });
router.beforeEach((to, from, next) => {
  let user = getAuth().currentUser;
  let admin = null;
  if (user) {
    getIdTokenResult(user)
      .then((token) => {
        admin = token.claims.admin;
        if (to.matched.some((res) => res.meta.requiresAuth)) {
          if (user) {
            if (to.matched.some((res) => res.meta.requiresAdmin)) {
              if (admin) {
                return next();
              }
              return next({ name: "Home" });
            }
            return next();
          }
          return next({ name: "Home" });
        }
        return next();
      })
      .catch((error) => {
        console.error(error);
        return next({ name: "Home" });
      });
  } else {
    return next();
  }
});

export default router
