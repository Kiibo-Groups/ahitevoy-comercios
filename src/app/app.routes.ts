import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'onboarding',
    pathMatch: 'full',
  },
  {
    path: 'onboarding',
    loadComponent: () => import('./onboarding/onboarding.page').then( m => m.OnboardingPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then( m => m.HomePage)
  },
  {
    path: 'login',
    loadComponent: () => import('./account/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'forgot',
    loadComponent: () => import('./account/forgot/forgot.page').then( m => m.ForgotPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./account/profile/profile.page').then( m => m.ProfilePage)
  },
  {
    path: 'order',
    loadComponent: () => import('./account/order/order.page').then( m => m.OrderPage)
  },
  {
    path: 'detail',
    loadComponent: () => import('./detail/detail.page').then( m => m.DetailPage)
  },
  {
    path: 'charts',
    loadComponent: () => import('./account/charts/charts.page').then( m => m.ChartsPage)
  },
  {
    path: 'delete-account',
    loadComponent: () => import('./account/delete-account/delete-account.page').then( m => m.DeleteAccountPage)
  },
  {
    path: 'info-pay',
    loadComponent: () => import('./info-pay/info-pay.page').then( m => m.InfoPayPage)
  },
  {
    path: 'dboy/:id',
    loadComponent: () => import('./dboy/dboy.page').then( m => m.DboyPage)
  },
  {
    path: 'item',
    loadComponent: () => import('./item/item.page').then( m => m.ItemPage)
  },
  {
    path: 'info-pay',
    loadComponent: () => import('./detail/info-pay/info-pay.page').then( m => m.InfoPayPage)
  },
  {
    path: 'all-orders',
    loadComponent: () => import('./all-orders/all-orders.page').then( m => m.AllOrdersPage)
  },
  {
    path: 'signup',
    loadComponent: () => import('./account/signup/signup.page').then( m => m.SignupPage)
  },
  {
    path: 'shipments',
    loadComponent: () => import('./shipments/shipments.page').then( m => m.ShipmentsPage)
  },
  {
    path: 'done-comm',
    loadComponent: () => import('./done-comm/done-comm.page').then( m => m.DoneCommPage)
  }
];
