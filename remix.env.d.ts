/// <reference types="@remix-run/dev" />
/// <reference types="@shopify/remix-oxygen" />
/// <reference types="@shopify/oxygen-workers-types" />

TWITCH_CLIENT_ID='mukk38tcugqilmunareammmu5q0xzs'
TWITCH_CLIENT_SECRET='nyg2vkr8h25r34wr5ht95dbxdq59n4'

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';

import type {Storefront, HydrogenCart} from '@shopify/hydrogen';
import type {
  LanguageCode,
  CountryCode,
} from '@shopify/hydrogen/storefront-api-types';
import type {CustomerAccessToken} from '@shopify/hydrogen/storefront-api-types';
import type {HydrogenSession} from './server';

declare global {
  /**
   * A global `process` object is only available during build to access NODE_ENV.
   */
  const process: {env: {
    [x: string]: string;NODE_ENV: 'production' | 'development'
}};

  /**
   * Declare expected Env parameter in fetch handler.
   */
  interface Env {
    SESSION_SECRET: string;
    PUBLIC_STOREFRONT_API_TOKEN: string;
    PRIVATE_STOREFRONT_API_TOKEN: string;
    PUBLIC_STORE_DOMAIN: string;
    PUBLIC_STOREFRONT_ID: string;
    TWITCH_CLIENT_ID: string;
    TWITCH_CLIENT_SECRET: string;
    YOUTUBE_API: string;
  }

  /**
   * The I18nLocale used for Storefront API query context.
   */
  type I18nLocale = {
    language: LanguageCode;
    country: CountryCode;
    pathPrefix: string;
  };
}

declare module '@shopify/remix-oxygen' {
  /**
   * Declare local additions to the Remix loader context.
   */
  export interface AppLoadContext {
    env: Env;
    cart: HydrogenCart;
    storefront: Storefront<I18nLocale>;
    session: HydrogenSession;
    waitUntil: ExecutionContext['waitUntil'];
  }

  /**
   * Declare the data we expect to access via `context.session`.
   */
  export interface SessionData {
    customerAccessToken: CustomerAccessToken;
  }
}
