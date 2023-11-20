import NProgress from "@/helper/progress";

export function routerEach() {
  const router = useRouter();
  NProgress.start();

  router.beforeEach((to, from, next) => {
    NProgress.remove();
    NProgress.set(0);
    NProgress.start();
    next();
  });

  router.afterEach(() => {
    NProgress.done();
  });
}
