import Vue from 'vue';
import Drawer from '../../drawer/drawer.vue';
import AppNotifications from '../../app-notifications/app-notifications.vue';
import AppModal from '../../app-modal/app-modal.vue';
import ZoomImage from '../../zoom-image/zoom-image.vue';
import App from 'phyrus-nuxt/src/modules/app';

export default Vue.extend({
  components: { Drawer, AppNotifications, AppModal, ZoomImage },

  mounted() {
    App.drawer.setReference(this.$refs.appDrawer);
    App.notifications.setReference(this.$refs.appNotifications);
    App.modal.setReference(this.$refs.appModal);
    App.zoomedImage.setReference(this.$refs.zoomImage);
  }
});