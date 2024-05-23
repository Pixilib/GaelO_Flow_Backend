'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">gaelo-flow documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppModule-5943311b73fe604819b4f05afafc7bee51768f94d8ae5a2f35140880d5f3bf2f7bb7407507e9133a217d413c2372adc4a0a799008d3ec3d973ab20bdc28410bb"' : 'data-bs-target="#xs-controllers-links-module-AppModule-5943311b73fe604819b4f05afafc7bee51768f94d8ae5a2f35140880d5f3bf2f7bb7407507e9133a217d413c2372adc4a0a799008d3ec3d973ab20bdc28410bb"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-5943311b73fe604819b4f05afafc7bee51768f94d8ae5a2f35140880d5f3bf2f7bb7407507e9133a217d413c2372adc4a0a799008d3ec3d973ab20bdc28410bb"' :
                                            'id="xs-controllers-links-module-AppModule-5943311b73fe604819b4f05afafc7bee51768f94d8ae5a2f35140880d5f3bf2f7bb7407507e9133a217d413c2372adc4a0a799008d3ec3d973ab20bdc28410bb"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-5943311b73fe604819b4f05afafc7bee51768f94d8ae5a2f35140880d5f3bf2f7bb7407507e9133a217d413c2372adc4a0a799008d3ec3d973ab20bdc28410bb"' : 'data-bs-target="#xs-injectables-links-module-AppModule-5943311b73fe604819b4f05afafc7bee51768f94d8ae5a2f35140880d5f3bf2f7bb7407507e9133a217d413c2372adc4a0a799008d3ec3d973ab20bdc28410bb"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-5943311b73fe604819b4f05afafc7bee51768f94d8ae5a2f35140880d5f3bf2f7bb7407507e9133a217d413c2372adc4a0a799008d3ec3d973ab20bdc28410bb"' :
                                        'id="xs-injectables-links-module-AppModule-5943311b73fe604819b4f05afafc7bee51768f94d8ae5a2f35140880d5f3bf2f7bb7407507e9133a217d413c2372adc4a0a799008d3ec3d973ab20bdc28410bb"' }>
                                        <li class="link">
                                            <a href="injectables/ProcessingClient.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProcessingClient</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthModule-dd76cd12c474d1224cf21c8faeb9cf3c99775aeb1e7a4f72685247aba881a486d253ece1f2ae392151ec5c790ed3edb761f28d11dab7fbb2d68969cf770be30c"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-dd76cd12c474d1224cf21c8faeb9cf3c99775aeb1e7a4f72685247aba881a486d253ece1f2ae392151ec5c790ed3edb761f28d11dab7fbb2d68969cf770be30c"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-dd76cd12c474d1224cf21c8faeb9cf3c99775aeb1e7a4f72685247aba881a486d253ece1f2ae392151ec5c790ed3edb761f28d11dab7fbb2d68969cf770be30c"' :
                                            'id="xs-controllers-links-module-AuthModule-dd76cd12c474d1224cf21c8faeb9cf3c99775aeb1e7a4f72685247aba881a486d253ece1f2ae392151ec5c790ed3edb761f28d11dab7fbb2d68969cf770be30c"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-dd76cd12c474d1224cf21c8faeb9cf3c99775aeb1e7a4f72685247aba881a486d253ece1f2ae392151ec5c790ed3edb761f28d11dab7fbb2d68969cf770be30c"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-dd76cd12c474d1224cf21c8faeb9cf3c99775aeb1e7a4f72685247aba881a486d253ece1f2ae392151ec5c790ed3edb761f28d11dab7fbb2d68969cf770be30c"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-dd76cd12c474d1224cf21c8faeb9cf3c99775aeb1e7a4f72685247aba881a486d253ece1f2ae392151ec5c790ed3edb761f28d11dab7fbb2d68969cf770be30c"' :
                                        'id="xs-injectables-links-module-AuthModule-dd76cd12c474d1224cf21c8faeb9cf3c99775aeb1e7a4f72685247aba881a486d253ece1f2ae392151ec5c790ed3edb761f28d11dab7fbb2d68969cf770be30c"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtOauthStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtOauthStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LocalStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LocalStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/MailService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MailService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/OauthConfigService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OauthConfigService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AutoroutingsModule.html" data-type="entity-link" >AutoroutingsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AutoroutingsModule-21dee9c17ebabc420b3a0fe803df68e467cb83d6e1773cb32e3ce6f97554fc6d36be5bed1db428af7c956b383cf34ae0a122b12f7000cb46058b53e675644e0b"' : 'data-bs-target="#xs-controllers-links-module-AutoroutingsModule-21dee9c17ebabc420b3a0fe803df68e467cb83d6e1773cb32e3ce6f97554fc6d36be5bed1db428af7c956b383cf34ae0a122b12f7000cb46058b53e675644e0b"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AutoroutingsModule-21dee9c17ebabc420b3a0fe803df68e467cb83d6e1773cb32e3ce6f97554fc6d36be5bed1db428af7c956b383cf34ae0a122b12f7000cb46058b53e675644e0b"' :
                                            'id="xs-controllers-links-module-AutoroutingsModule-21dee9c17ebabc420b3a0fe803df68e467cb83d6e1773cb32e3ce6f97554fc6d36be5bed1db428af7c956b383cf34ae0a122b12f7000cb46058b53e675644e0b"' }>
                                            <li class="link">
                                                <a href="controllers/AutoroutingsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AutoroutingsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AutoroutingsModule-21dee9c17ebabc420b3a0fe803df68e467cb83d6e1773cb32e3ce6f97554fc6d36be5bed1db428af7c956b383cf34ae0a122b12f7000cb46058b53e675644e0b"' : 'data-bs-target="#xs-injectables-links-module-AutoroutingsModule-21dee9c17ebabc420b3a0fe803df68e467cb83d6e1773cb32e3ce6f97554fc6d36be5bed1db428af7c956b383cf34ae0a122b12f7000cb46058b53e675644e0b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AutoroutingsModule-21dee9c17ebabc420b3a0fe803df68e467cb83d6e1773cb32e3ce6f97554fc6d36be5bed1db428af7c956b383cf34ae0a122b12f7000cb46058b53e675644e0b"' :
                                        'id="xs-injectables-links-module-AutoroutingsModule-21dee9c17ebabc420b3a0fe803df68e467cb83d6e1773cb32e3ce6f97554fc6d36be5bed1db428af7c956b383cf34ae0a122b12f7000cb46058b53e675644e0b"' }>
                                        <li class="link">
                                            <a href="injectables/AutoroutingHandler.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AutoroutingHandler</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AutoroutingsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AutoroutingsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/OrthancClient.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrthancClient</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ProcessingQueueService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProcessingQueueService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/GuardsModule.html" data-type="entity-link" >GuardsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-GuardsModule-8a3e5ebfa6103b9b017a89bc31ff6a4feffe1fb4af1b5802798cb60c11a2ee4098dd9c6047db72c5f6fcdf49ffdc7e401b1a5f2e80814ceb4cac3071ff29c438"' : 'data-bs-target="#xs-injectables-links-module-GuardsModule-8a3e5ebfa6103b9b017a89bc31ff6a4feffe1fb4af1b5802798cb60c11a2ee4098dd9c6047db72c5f6fcdf49ffdc7e401b1a5f2e80814ceb4cac3071ff29c438"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-GuardsModule-8a3e5ebfa6103b9b017a89bc31ff6a4feffe1fb4af1b5802798cb60c11a2ee4098dd9c6047db72c5f6fcdf49ffdc7e401b1a5f2e80814ceb4cac3071ff29c438"' :
                                        'id="xs-injectables-links-module-GuardsModule-8a3e5ebfa6103b9b017a89bc31ff6a4feffe1fb4af1b5802798cb60c11a2ee4098dd9c6047db72c5f6fcdf49ffdc7e401b1a5f2e80814ceb4cac3071ff29c438"' }>
                                        <li class="link">
                                            <a href="injectables/InstanceGuard.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >InstanceGuard</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtAuthGuard.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtAuthGuard</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtOAuthGuard.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtOAuthGuard</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LocalAuthGuard.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LocalAuthGuard</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/OrthancClient.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrthancClient</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SeriesGuard.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SeriesGuard</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/LabelsModule.html" data-type="entity-link" >LabelsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-LabelsModule-5b8d48b4241106b2d37fd592a2ea820e99859114131240a8b485c01c1e8f7f73afcaf521b843095365f4ea30c10cc4f0452eb57b4bcafac63c4269a3e484dcc4"' : 'data-bs-target="#xs-controllers-links-module-LabelsModule-5b8d48b4241106b2d37fd592a2ea820e99859114131240a8b485c01c1e8f7f73afcaf521b843095365f4ea30c10cc4f0452eb57b4bcafac63c4269a3e484dcc4"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-LabelsModule-5b8d48b4241106b2d37fd592a2ea820e99859114131240a8b485c01c1e8f7f73afcaf521b843095365f4ea30c10cc4f0452eb57b4bcafac63c4269a3e484dcc4"' :
                                            'id="xs-controllers-links-module-LabelsModule-5b8d48b4241106b2d37fd592a2ea820e99859114131240a8b485c01c1e8f7f73afcaf521b843095365f4ea30c10cc4f0452eb57b4bcafac63c4269a3e484dcc4"' }>
                                            <li class="link">
                                                <a href="controllers/LabelsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LabelsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-LabelsModule-5b8d48b4241106b2d37fd592a2ea820e99859114131240a8b485c01c1e8f7f73afcaf521b843095365f4ea30c10cc4f0452eb57b4bcafac63c4269a3e484dcc4"' : 'data-bs-target="#xs-injectables-links-module-LabelsModule-5b8d48b4241106b2d37fd592a2ea820e99859114131240a8b485c01c1e8f7f73afcaf521b843095365f4ea30c10cc4f0452eb57b4bcafac63c4269a3e484dcc4"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-LabelsModule-5b8d48b4241106b2d37fd592a2ea820e99859114131240a8b485c01c1e8f7f73afcaf521b843095365f4ea30c10cc4f0452eb57b4bcafac63c4269a3e484dcc4"' :
                                        'id="xs-injectables-links-module-LabelsModule-5b8d48b4241106b2d37fd592a2ea820e99859114131240a8b485c01c1e8f7f73afcaf521b843095365f4ea30c10cc4f0452eb57b4bcafac63c4269a3e484dcc4"' }>
                                        <li class="link">
                                            <a href="injectables/LabelsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LabelsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/MailModule.html" data-type="entity-link" >MailModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/OauthConfigModule.html" data-type="entity-link" >OauthConfigModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-OauthConfigModule-4e4fedb6a6ff78dc5c8912f2bdd2af785e44e3379a4895c0ab7d8727f0f258e2b5faa41831c630b568e92f767d986bb4b4419744908ea7ace979615a96086e5f"' : 'data-bs-target="#xs-controllers-links-module-OauthConfigModule-4e4fedb6a6ff78dc5c8912f2bdd2af785e44e3379a4895c0ab7d8727f0f258e2b5faa41831c630b568e92f767d986bb4b4419744908ea7ace979615a96086e5f"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-OauthConfigModule-4e4fedb6a6ff78dc5c8912f2bdd2af785e44e3379a4895c0ab7d8727f0f258e2b5faa41831c630b568e92f767d986bb4b4419744908ea7ace979615a96086e5f"' :
                                            'id="xs-controllers-links-module-OauthConfigModule-4e4fedb6a6ff78dc5c8912f2bdd2af785e44e3379a4895c0ab7d8727f0f258e2b5faa41831c630b568e92f767d986bb4b4419744908ea7ace979615a96086e5f"' }>
                                            <li class="link">
                                                <a href="controllers/OauthConfigController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OauthConfigController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-OauthConfigModule-4e4fedb6a6ff78dc5c8912f2bdd2af785e44e3379a4895c0ab7d8727f0f258e2b5faa41831c630b568e92f767d986bb4b4419744908ea7ace979615a96086e5f"' : 'data-bs-target="#xs-injectables-links-module-OauthConfigModule-4e4fedb6a6ff78dc5c8912f2bdd2af785e44e3379a4895c0ab7d8727f0f258e2b5faa41831c630b568e92f767d986bb4b4419744908ea7ace979615a96086e5f"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-OauthConfigModule-4e4fedb6a6ff78dc5c8912f2bdd2af785e44e3379a4895c0ab7d8727f0f258e2b5faa41831c630b568e92f767d986bb4b4419744908ea7ace979615a96086e5f"' :
                                        'id="xs-injectables-links-module-OauthConfigModule-4e4fedb6a6ff78dc5c8912f2bdd2af785e44e3379a4895c0ab7d8727f0f258e2b5faa41831c630b568e92f767d986bb4b4419744908ea7ace979615a96086e5f"' }>
                                        <li class="link">
                                            <a href="injectables/OauthConfigService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OauthConfigService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/OptionsModule.html" data-type="entity-link" >OptionsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-OptionsModule-b2999ca4588d3fc061749829f958648d7703b280227751ae875d5d7e547d7a597546d3ef9925efc5dcf7b0e14af5eab83ce89becb0218ead3fcc260424fedfae"' : 'data-bs-target="#xs-controllers-links-module-OptionsModule-b2999ca4588d3fc061749829f958648d7703b280227751ae875d5d7e547d7a597546d3ef9925efc5dcf7b0e14af5eab83ce89becb0218ead3fcc260424fedfae"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-OptionsModule-b2999ca4588d3fc061749829f958648d7703b280227751ae875d5d7e547d7a597546d3ef9925efc5dcf7b0e14af5eab83ce89becb0218ead3fcc260424fedfae"' :
                                            'id="xs-controllers-links-module-OptionsModule-b2999ca4588d3fc061749829f958648d7703b280227751ae875d5d7e547d7a597546d3ef9925efc5dcf7b0e14af5eab83ce89becb0218ead3fcc260424fedfae"' }>
                                            <li class="link">
                                                <a href="controllers/OptionsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OptionsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-OptionsModule-b2999ca4588d3fc061749829f958648d7703b280227751ae875d5d7e547d7a597546d3ef9925efc5dcf7b0e14af5eab83ce89becb0218ead3fcc260424fedfae"' : 'data-bs-target="#xs-injectables-links-module-OptionsModule-b2999ca4588d3fc061749829f958648d7703b280227751ae875d5d7e547d7a597546d3ef9925efc5dcf7b0e14af5eab83ce89becb0218ead3fcc260424fedfae"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-OptionsModule-b2999ca4588d3fc061749829f958648d7703b280227751ae875d5d7e547d7a597546d3ef9925efc5dcf7b0e14af5eab83ce89becb0218ead3fcc260424fedfae"' :
                                        'id="xs-injectables-links-module-OptionsModule-b2999ca4588d3fc061749829f958648d7703b280227751ae875d5d7e547d7a597546d3ef9925efc5dcf7b0e14af5eab83ce89becb0218ead3fcc260424fedfae"' }>
                                        <li class="link">
                                            <a href="injectables/OptionsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OptionsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/OrthancModule.html" data-type="entity-link" >OrthancModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-OrthancModule-fa4ab9a1a523cc04d1d3fedf69d00ac3bfebbe3b40e218d31035ccf6f3a39db14a3e29feddbba19d6ef7a255d2b0ea14310aa956809bdc5e5fa3df60ee058661"' : 'data-bs-target="#xs-controllers-links-module-OrthancModule-fa4ab9a1a523cc04d1d3fedf69d00ac3bfebbe3b40e218d31035ccf6f3a39db14a3e29feddbba19d6ef7a255d2b0ea14310aa956809bdc5e5fa3df60ee058661"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-OrthancModule-fa4ab9a1a523cc04d1d3fedf69d00ac3bfebbe3b40e218d31035ccf6f3a39db14a3e29feddbba19d6ef7a255d2b0ea14310aa956809bdc5e5fa3df60ee058661"' :
                                            'id="xs-controllers-links-module-OrthancModule-fa4ab9a1a523cc04d1d3fedf69d00ac3bfebbe3b40e218d31035ccf6f3a39db14a3e29feddbba19d6ef7a255d2b0ea14310aa956809bdc5e5fa3df60ee058661"' }>
                                            <li class="link">
                                                <a href="controllers/OrthancAdminController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrthancAdminController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/OrthancController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrthancController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/OrthancDeleteController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrthancDeleteController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/OrthancExportController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrthancExportController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/OrthancImportController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrthancImportController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/OrthancModifyController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrthancModifyController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/OrthancQueryController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrthancQueryController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/OrthancReadAllController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrthancReadAllController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-OrthancModule-fa4ab9a1a523cc04d1d3fedf69d00ac3bfebbe3b40e218d31035ccf6f3a39db14a3e29feddbba19d6ef7a255d2b0ea14310aa956809bdc5e5fa3df60ee058661"' : 'data-bs-target="#xs-injectables-links-module-OrthancModule-fa4ab9a1a523cc04d1d3fedf69d00ac3bfebbe3b40e218d31035ccf6f3a39db14a3e29feddbba19d6ef7a255d2b0ea14310aa956809bdc5e5fa3df60ee058661"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-OrthancModule-fa4ab9a1a523cc04d1d3fedf69d00ac3bfebbe3b40e218d31035ccf6f3a39db14a3e29feddbba19d6ef7a255d2b0ea14310aa956809bdc5e5fa3df60ee058661"' :
                                        'id="xs-injectables-links-module-OrthancModule-fa4ab9a1a523cc04d1d3fedf69d00ac3bfebbe3b40e218d31035ccf6f3a39db14a3e29feddbba19d6ef7a255d2b0ea14310aa956809bdc5e5fa3df60ee058661"' }>
                                        <li class="link">
                                            <a href="injectables/OrthancClient.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrthancClient</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProcessingModule.html" data-type="entity-link" >ProcessingModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ProcessingModule-a1acb3882be796a760fa949e8e0fa627fff4c6208e547190902b696126b15fa22af4330e77365e54210cc92057e026910de9a98d95d37d4cfbadfb7734d7fc90"' : 'data-bs-target="#xs-controllers-links-module-ProcessingModule-a1acb3882be796a760fa949e8e0fa627fff4c6208e547190902b696126b15fa22af4330e77365e54210cc92057e026910de9a98d95d37d4cfbadfb7734d7fc90"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ProcessingModule-a1acb3882be796a760fa949e8e0fa627fff4c6208e547190902b696126b15fa22af4330e77365e54210cc92057e026910de9a98d95d37d4cfbadfb7734d7fc90"' :
                                            'id="xs-controllers-links-module-ProcessingModule-a1acb3882be796a760fa949e8e0fa627fff4c6208e547190902b696126b15fa22af4330e77365e54210cc92057e026910de9a98d95d37d4cfbadfb7734d7fc90"' }>
                                            <li class="link">
                                                <a href="controllers/ProcessingController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProcessingController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ProcessingModule-a1acb3882be796a760fa949e8e0fa627fff4c6208e547190902b696126b15fa22af4330e77365e54210cc92057e026910de9a98d95d37d4cfbadfb7734d7fc90"' : 'data-bs-target="#xs-injectables-links-module-ProcessingModule-a1acb3882be796a760fa949e8e0fa627fff4c6208e547190902b696126b15fa22af4330e77365e54210cc92057e026910de9a98d95d37d4cfbadfb7734d7fc90"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ProcessingModule-a1acb3882be796a760fa949e8e0fa627fff4c6208e547190902b696126b15fa22af4330e77365e54210cc92057e026910de9a98d95d37d4cfbadfb7734d7fc90"' :
                                        'id="xs-injectables-links-module-ProcessingModule-a1acb3882be796a760fa949e8e0fa627fff4c6208e547190902b696126b15fa22af4330e77365e54210cc92057e026910de9a98d95d37d4cfbadfb7734d7fc90"' }>
                                        <li class="link">
                                            <a href="injectables/ProcessingQueueService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProcessingQueueService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/QueueModule.html" data-type="entity-link" >QueueModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-QueueModule-9a1a2115f418d943bfe1fc0d4cdb8e6bac04fd75baca71a035ac34190c642ad331105d63f760d6a69058bcdd52eb4e1dea8ccc7933febea2d0a4272915b74d9d"' : 'data-bs-target="#xs-controllers-links-module-QueueModule-9a1a2115f418d943bfe1fc0d4cdb8e6bac04fd75baca71a035ac34190c642ad331105d63f760d6a69058bcdd52eb4e1dea8ccc7933febea2d0a4272915b74d9d"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-QueueModule-9a1a2115f418d943bfe1fc0d4cdb8e6bac04fd75baca71a035ac34190c642ad331105d63f760d6a69058bcdd52eb4e1dea8ccc7933febea2d0a4272915b74d9d"' :
                                            'id="xs-controllers-links-module-QueueModule-9a1a2115f418d943bfe1fc0d4cdb8e6bac04fd75baca71a035ac34190c642ad331105d63f760d6a69058bcdd52eb4e1dea8ccc7933febea2d0a4272915b74d9d"' }>
                                            <li class="link">
                                                <a href="controllers/QueuesAnonController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QueuesAnonController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/QueuesDeleteController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QueuesDeleteController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/QueuesQueryController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QueuesQueryController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-QueueModule-9a1a2115f418d943bfe1fc0d4cdb8e6bac04fd75baca71a035ac34190c642ad331105d63f760d6a69058bcdd52eb4e1dea8ccc7933febea2d0a4272915b74d9d"' : 'data-bs-target="#xs-injectables-links-module-QueueModule-9a1a2115f418d943bfe1fc0d4cdb8e6bac04fd75baca71a035ac34190c642ad331105d63f760d6a69058bcdd52eb4e1dea8ccc7933febea2d0a4272915b74d9d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-QueueModule-9a1a2115f418d943bfe1fc0d4cdb8e6bac04fd75baca71a035ac34190c642ad331105d63f760d6a69058bcdd52eb4e1dea8ccc7933febea2d0a4272915b74d9d"' :
                                        'id="xs-injectables-links-module-QueueModule-9a1a2115f418d943bfe1fc0d4cdb8e6bac04fd75baca71a035ac34190c642ad331105d63f760d6a69058bcdd52eb4e1dea8ccc7933febea2d0a4272915b74d9d"' }>
                                        <li class="link">
                                            <a href="injectables/QueuesAnonService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QueuesAnonService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/QueuesDeleteService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QueuesDeleteService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/QueuesQueryService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QueuesQueryService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RolesModule.html" data-type="entity-link" >RolesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-RolesModule-eb61bb9434492cd79e67f464469c6b76a6b7b835e586301232b8dc595174efb88cbb9510e7297f3221c10cbccf4513cc05f21fd16542471bde425180ac938664"' : 'data-bs-target="#xs-controllers-links-module-RolesModule-eb61bb9434492cd79e67f464469c6b76a6b7b835e586301232b8dc595174efb88cbb9510e7297f3221c10cbccf4513cc05f21fd16542471bde425180ac938664"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-RolesModule-eb61bb9434492cd79e67f464469c6b76a6b7b835e586301232b8dc595174efb88cbb9510e7297f3221c10cbccf4513cc05f21fd16542471bde425180ac938664"' :
                                            'id="xs-controllers-links-module-RolesModule-eb61bb9434492cd79e67f464469c6b76a6b7b835e586301232b8dc595174efb88cbb9510e7297f3221c10cbccf4513cc05f21fd16542471bde425180ac938664"' }>
                                            <li class="link">
                                                <a href="controllers/RolesController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RolesController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-RolesModule-eb61bb9434492cd79e67f464469c6b76a6b7b835e586301232b8dc595174efb88cbb9510e7297f3221c10cbccf4513cc05f21fd16542471bde425180ac938664"' : 'data-bs-target="#xs-injectables-links-module-RolesModule-eb61bb9434492cd79e67f464469c6b76a6b7b835e586301232b8dc595174efb88cbb9510e7297f3221c10cbccf4513cc05f21fd16542471bde425180ac938664"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RolesModule-eb61bb9434492cd79e67f464469c6b76a6b7b835e586301232b8dc595174efb88cbb9510e7297f3221c10cbccf4513cc05f21fd16542471bde425180ac938664"' :
                                        'id="xs-injectables-links-module-RolesModule-eb61bb9434492cd79e67f464469c6b76a6b7b835e586301232b8dc595174efb88cbb9510e7297f3221c10cbccf4513cc05f21fd16542471bde425180ac938664"' }>
                                        <li class="link">
                                            <a href="injectables/LabelsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LabelsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RolesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RolesService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SeederModule.html" data-type="entity-link" >SeederModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-SeederModule-fa8271059a4e86c0abb71b1abd5ac53398f9367315db37c23df185e43a580247e02aeab1797c23aa6cb444d8cc483ff1142c0037f0566ce154d1b8cf6b6f02ad"' : 'data-bs-target="#xs-injectables-links-module-SeederModule-fa8271059a4e86c0abb71b1abd5ac53398f9367315db37c23df185e43a580247e02aeab1797c23aa6cb444d8cc483ff1142c0037f0566ce154d1b8cf6b6f02ad"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SeederModule-fa8271059a4e86c0abb71b1abd5ac53398f9367315db37c23df185e43a580247e02aeab1797c23aa6cb444d8cc483ff1142c0037f0566ce154d1b8cf6b6f02ad"' :
                                        'id="xs-injectables-links-module-SeederModule-fa8271059a4e86c0abb71b1abd5ac53398f9367315db37c23df185e43a580247e02aeab1797c23aa6cb444d8cc483ff1142c0037f0566ce154d1b8cf6b6f02ad"' }>
                                        <li class="link">
                                            <a href="injectables/OauthConfigService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OauthConfigService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/OptionsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OptionsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RolesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RolesService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SeederService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SeederService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TasksModule.html" data-type="entity-link" >TasksModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-TasksModule-c225db7332fc7d54b100b52f385b4bdb9e09ad6fb1cc4329e9539c62f308b77f043c0c0bfe5d20c3eb4dafeb27ebbc4f5f1c4e79511cb2d0d17574824897c7e6"' : 'data-bs-target="#xs-injectables-links-module-TasksModule-c225db7332fc7d54b100b52f385b4bdb9e09ad6fb1cc4329e9539c62f308b77f043c0c0bfe5d20c3eb4dafeb27ebbc4f5f1c4e79511cb2d0d17574824897c7e6"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TasksModule-c225db7332fc7d54b100b52f385b4bdb9e09ad6fb1cc4329e9539c62f308b77f043c0c0bfe5d20c3eb4dafeb27ebbc4f5f1c4e79511cb2d0d17574824897c7e6"' :
                                        'id="xs-injectables-links-module-TasksModule-c225db7332fc7d54b100b52f385b4bdb9e09ad6fb1cc4329e9539c62f308b77f043c0c0bfe5d20c3eb4dafeb27ebbc4f5f1c4e79511cb2d0d17574824897c7e6"' }>
                                        <li class="link">
                                            <a href="injectables/OrthancClient.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrthancClient</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/OrthancMonitoringTask.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrthancMonitoringTask</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/QueryQueueTask.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QueryQueueTask</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/QueuesQueryService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QueuesQueryService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link" >UsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UsersModule-d83b00ca6bef50d42dea124b9706cc8ea18b1c82d77381cd0bc85aa8483eb33b7aa44afe400d03e6b671f58f75d1b505cedae9b258633283fd6a369da0166ce3"' : 'data-bs-target="#xs-controllers-links-module-UsersModule-d83b00ca6bef50d42dea124b9706cc8ea18b1c82d77381cd0bc85aa8483eb33b7aa44afe400d03e6b671f58f75d1b505cedae9b258633283fd6a369da0166ce3"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UsersModule-d83b00ca6bef50d42dea124b9706cc8ea18b1c82d77381cd0bc85aa8483eb33b7aa44afe400d03e6b671f58f75d1b505cedae9b258633283fd6a369da0166ce3"' :
                                            'id="xs-controllers-links-module-UsersModule-d83b00ca6bef50d42dea124b9706cc8ea18b1c82d77381cd0bc85aa8483eb33b7aa44afe400d03e6b671f58f75d1b505cedae9b258633283fd6a369da0166ce3"' }>
                                            <li class="link">
                                                <a href="controllers/UsersController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UsersModule-d83b00ca6bef50d42dea124b9706cc8ea18b1c82d77381cd0bc85aa8483eb33b7aa44afe400d03e6b671f58f75d1b505cedae9b258633283fd6a369da0166ce3"' : 'data-bs-target="#xs-injectables-links-module-UsersModule-d83b00ca6bef50d42dea124b9706cc8ea18b1c82d77381cd0bc85aa8483eb33b7aa44afe400d03e6b671f58f75d1b505cedae9b258633283fd6a369da0166ce3"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsersModule-d83b00ca6bef50d42dea124b9706cc8ea18b1c82d77381cd0bc85aa8483eb33b7aa44afe400d03e6b671f58f75d1b505cedae9b258633283fd6a369da0166ce3"' :
                                        'id="xs-injectables-links-module-UsersModule-d83b00ca6bef50d42dea124b9706cc8ea18b1c82d77381cd0bc85aa8483eb33b7aa44afe400d03e6b671f58f75d1b505cedae9b258633283fd6a369da0166ce3"' }>
                                        <li class="link">
                                            <a href="injectables/RolesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RolesService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#entities-links"' :
                                'data-bs-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/Autorouting.html" data-type="entity-link" >Autorouting</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Label.html" data-type="entity-link" >Label</a>
                                </li>
                                <li class="link">
                                    <a href="entities/OauthConfig.html" data-type="entity-link" >OauthConfig</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Option.html" data-type="entity-link" >Option</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Role.html" data-type="entity-link" >Role</a>
                                </li>
                                <li class="link">
                                    <a href="entities/User.html" data-type="entity-link" >User</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/ChangePasswordDto.html" data-type="entity-link" >ChangePasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateAutoroutingDto.html" data-type="entity-link" >CreateAutoroutingDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateOptionDto.html" data-type="entity-link" >CreateOptionDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateRoleDto.html" data-type="entity-link" >CreateRoleDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserDto.html" data-type="entity-link" >CreateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Destination.html" data-type="entity-link" >Destination</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetOptionDto.html" data-type="entity-link" >GetOptionDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetRoleDto.html" data-type="entity-link" >GetRoleDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUserDto.html" data-type="entity-link" >GetUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/HttpClient.html" data-type="entity-link" >HttpClient</a>
                            </li>
                            <li class="link">
                                <a href="classes/IsNumberOrString.html" data-type="entity-link" >IsNumberOrString</a>
                            </li>
                            <li class="link">
                                <a href="classes/LabelDto.html" data-type="entity-link" >LabelDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginDto.html" data-type="entity-link" >LoginDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LostPassworDto.html" data-type="entity-link" >LostPassworDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/OauthConfigDto.html" data-type="entity-link" >OauthConfigDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/OrthancEventPayloadDto.html" data-type="entity-link" >OrthancEventPayloadDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProcessingFile.html" data-type="entity-link" >ProcessingFile</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProcessingJobDto.html" data-type="entity-link" >ProcessingJobDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueryAnswer.html" data-type="entity-link" >QueryAnswer</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueryParsedAnswerDto.html" data-type="entity-link" >QueryParsedAnswerDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/QuerySeriesAnswer.html" data-type="entity-link" >QuerySeriesAnswer</a>
                            </li>
                            <li class="link">
                                <a href="classes/QuerySeriesDto.html" data-type="entity-link" >QuerySeriesDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueryStudyAnswer.html" data-type="entity-link" >QueryStudyAnswer</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueryStudyDto.html" data-type="entity-link" >QueryStudyDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueuesAnonDto.html" data-type="entity-link" >QueuesAnonDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueuesAnonsDto.html" data-type="entity-link" >QueuesAnonsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueuesDeleteDto.html" data-type="entity-link" >QueuesDeleteDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueuesQueryDto.html" data-type="entity-link" >QueuesQueryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueuesQuerySeriesDto.html" data-type="entity-link" >QueuesQuerySeriesDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueuesQueryStudyDto.html" data-type="entity-link" >QueuesQueryStudyDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegisterDto.html" data-type="entity-link" >RegisterDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Router.html" data-type="entity-link" >Router</a>
                            </li>
                            <li class="link">
                                <a href="classes/Rule.html" data-type="entity-link" >Rule</a>
                            </li>
                            <li class="link">
                                <a href="classes/TagAnon.html" data-type="entity-link" >TagAnon</a>
                            </li>
                            <li class="link">
                                <a href="classes/TmtvJobDto.html" data-type="entity-link" >TmtvJobDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/TmtvService.html" data-type="entity-link" >TmtvService</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateOptionDto.html" data-type="entity-link" >UpdateOptionDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserDto.html" data-type="entity-link" >UpdateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/WithLabels.html" data-type="entity-link" >WithLabels</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AbstractQueueService.html" data-type="entity-link" >AbstractQueueService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MaskProcessingService.html" data-type="entity-link" >MaskProcessingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NotFoundInterceptor.html" data-type="entity-link" >NotFoundInterceptor</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OrthancClient.html" data-type="entity-link" >OrthancClient</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProcessingClient.html" data-type="entity-link" >ProcessingClient</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AdminGuard.html" data-type="entity-link" >AdminGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/AnonymizeGuard.html" data-type="entity-link" >AnonymizeGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/AutoQueryGuard.html" data-type="entity-link" >AutoQueryGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/AutoRoutingGuard.html" data-type="entity-link" >AutoRoutingGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/CdBurnerGuard.html" data-type="entity-link" >CdBurnerGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/CheckLabelInRole.html" data-type="entity-link" >CheckLabelInRole</a>
                            </li>
                            <li class="link">
                                <a href="guards/CheckUserIdParamsGuard.html" data-type="entity-link" >CheckUserIdParamsGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/CheckUserIdQueryGuard.html" data-type="entity-link" >CheckUserIdQueryGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/CheckUserRoleGuard.html" data-type="entity-link" >CheckUserRoleGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/DeleteGuard.html" data-type="entity-link" >DeleteGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/DicomWebGuard.html" data-type="entity-link" >DicomWebGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/ExportGuard.html" data-type="entity-link" >ExportGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/ImportGuard.html" data-type="entity-link" >ImportGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/ModifyGuard.html" data-type="entity-link" >ModifyGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/QueryGuard.html" data-type="entity-link" >QueryGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/ReadAllGuard.html" data-type="entity-link" >ReadAllGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/StudyGuard.html" data-type="entity-link" >StudyGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/OrGuardOptions.html" data-type="entity-link" >OrGuardOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserInfoResponse.html" data-type="entity-link" >UserInfoResponse</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});