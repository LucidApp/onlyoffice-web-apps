import React, {Component, useEffect} from 'react';
import {View,Page,Navbar,NavRight,Link,Popup,Popover,Icon,ListItem,List} from 'framework7-react';
import { useTranslation } from 'react-i18next';
import {f7} from 'framework7-react';
import {Device} from '../../../../../common/mobile/utils/device';
import { observer, inject } from "mobx-react";
import ApplicationSettingsController from "../../controller/settings/ApplicationSettings";
import { MacrosSettings } from "./ApplicationSettings";
import DownloadController from "../../controller/settings/Download";
import PresentationInfoController from "../../controller/settings/PresentationInfo";
import PresentationSettingsController from "../../controller/settings/PresentationSettings";
import { PresentationColorSchemes } from "./PresentationSettings";
// import PresentationAboutController from '../../controller/settings/PresentationAbout';
import About from '../../../../../common/mobile/lib/view/About';
import SharingSettings from "../../../../../common/mobile/lib/view/SharingSettings";

const routes = [
    {
        path: '/',
        component: 'TSettingsView'
    },
    {
        path: '/application-settings/',
        component: ApplicationSettingsController
    },
    {
        path: '/macros-settings/',
        component: MacrosSettings
    }, 
    {
        path: '/download/',
        component: DownloadController
    },
    {
        path: '/presentation-info/',
        component: PresentationInfoController
    },
    {
        path: '/presentation-settings/',
        component: PresentationSettingsController
    },
    {
        path: '/color-schemes/',
        component: PresentationColorSchemes
    },
    {
        path: '/about/',
        component: About
    },
    /*{
        path: '/presentation-settings/',
        component: PresentationSettingsController,
    },
    {
        path: "/presentation-info/",
        component: PresentationInfoController,
    }*/
];


const SettingsList = inject("storeAppOptions", "storeToolbarSettings")(observer(props => {
    const { t } = useTranslation();
    const _t = t('View.Settings', {returnObjects: true});
    const storeToolbarSettings = props.storeToolbarSettings;
    const disabledPreview = storeToolbarSettings.countPages <= 0;

    const navbar = <Navbar title={_t.textSettings}>
        {!props.inPopover  && <NavRight><Link popupClose=".settings-popup">{_t.textDone}</Link></NavRight>}
    </Navbar>;

    const onoptionclick = page => {
        if ( props.onOptionClick )
            props.onOptionClick(page)
    };

    const closeModal = () => {
        if (Device.phone) {
            f7.sheet.close('.settings-popup', false);
        } else {
            f7.popover.close('#settings-popover', false);
        }
    };

    const onOpenCollaboration = async () => {
        await closeModal();
        await props.openOptions('coauth');
    }

    const onPrint = () => {
        const api = Common.EditorApi.get();

        closeModal();
        setTimeout(() => {
            api.asc_Print();
        }, 400);
    };

    const showHelp = () => {
        // let url = '{{HELP_URL}}';
        let url = __HELP_URL__;
        // let url = 'https://helpcenter.onlyoffice.com';

        if (url.charAt(url.length-1) !== '/') {
            url += '/';
        }

        if (Device.sailfish || Device.android) {
            url+='mobile-applications/documents/mobile-web-editors/android/index.aspx';
        } 
        else {
            url+='mobile-applications/documents/mobile-web-editors/ios/index.aspx';
        }

        closeModal();
        window.open(url, "_blank");
    };

    const showFeedback = () => {
        let config = props.storeAppOptions.config;

        closeModal();
        if(config && !!config.feedback && !!config.feedback.url) {
            window.open(config.feedback.url, "_blank");
        } else window.open(__SUPPORT_URL__, "_blank");
    };

    const appOptions = props.storeAppOptions;
    let _isEdit = false,
        _canDownload = false,
        _canDownloadOrigin = false,
        _canAbout = true,
        _canHelp = true,
        _canPrint = false;

    if (appOptions.isDisconnected) {
        _isEdit = false;
        if (!appOptions.enableDownload)
            _canPrint = _canDownload = _canDownloadOrigin = false;
    } else {
        _isEdit = appOptions.isEdit;
        _canDownload = appOptions.canDownload;
        _canDownloadOrigin = appOptions.canDownloadOrigin;
        _canPrint = appOptions.canPrint;
        if (appOptions.customization && appOptions.canBrandingExt) {
            _canAbout = (appOptions.customization.about!==false);
        }
        if (appOptions.customization) {
            _canHelp = (appOptions.customization.help!==false);
        }
    }

    const onDownloadOrigin = () => {
        closeModal();
        setTimeout(() => {
            Common.EditorApi.get().asc_DownloadOrigin();
        }, 0);
    };
    
    return (
        <View style={props.style} stackPages={true} routes={routes}>
            <Page>
                {navbar}
                <List>
                    {!props.inPopover &&
                        <ListItem disabled={appOptions.readerMode || disabledPreview ? true : false} title={!_isEdit ? _t.textFind : _t.textFindAndReplace} link="#" searchbarEnable='.searchbar' onClick={closeModal} className='no-indicator'>
                            <Icon slot="media" icon="icon-search"></Icon>
                        </ListItem>
                    }
                    {window.matchMedia("(max-width: 374px)").matches ?
                        <ListItem title={_t.textCollaboration} link="#" onClick={onOpenCollaboration} className='no-indicator'>
                            <Icon slot="media" icon="icon-collaboration"></Icon>
                        </ListItem> 
                    : null}
                    {_isEdit && 
                        <ListItem link="#" title={_t.textPresentationSettings} onClick={onoptionclick.bind(this, '/presentation-settings/')}>
                            <Icon slot="media" icon="icon-setup"></Icon>
                        </ListItem>
                    }
                    <ListItem title={_t.textApplicationSettings} link="#" onClick={onoptionclick.bind(this, '/application-settings/')}>
                        <Icon slot="media" icon="icon-app-settings"></Icon>
                    </ListItem>
                    {_canDownload &&
                        <ListItem title={_t.textDownload} link="#" onClick={onoptionclick.bind(this, '/download/')}>
                            <Icon slot="media" icon="icon-download"></Icon>
                        </ListItem>
                    }
                    {_canDownloadOrigin &&
                        <ListItem title={_t.textDownload} link="#" onClick={onDownloadOrigin} className='no-indicator'>
                            <Icon slot="media" icon="icon-download"></Icon>
                        </ListItem>
                    }
                    {_canPrint &&
                        <ListItem className={disabledPreview && 'disabled'} title={_t.textPrint} onClick={onPrint}>
                            <Icon slot="media" icon="icon-print"></Icon>
                        </ListItem>
                    }
                    <ListItem title={_t.textPresentationInfo} link="#" onClick={onoptionclick.bind(this, "/presentation-info/")}>
                        <Icon slot="media" icon="icon-info"></Icon>
                    </ListItem>
                    <ListItem title={_t.textHelp} link="#" className='no-indicator' onClick={showHelp}>
                        <Icon slot="media" icon="icon-help"></Icon>
                    </ListItem>
                    <ListItem title={_t.textAbout} link="#" onClick={onoptionclick.bind(this, "/about/")}>
                        <Icon slot="media" icon="icon-about"></Icon>
                    </ListItem>
                    <ListItem title={t('View.Settings.textFeedback')} link="#" className='no-indicator' onClick={showFeedback}>
                            <Icon slot="media" icon="icon-feedback"></Icon>
                    </ListItem>
                </List>
            </Page>
        </View>
    )
}));

class SettingsView extends Component {
    constructor(props) {
        super(props);

        this.onoptionclick = this.onoptionclick.bind(this);
    }

    onoptionclick(page){
        f7.views.current.router.navigate(page);
    }

    render() {
        const show_popover = this.props.usePopover;
       
        return (
            show_popover ?
                <Popover id="settings-popover" className="popover__titled" onPopoverClosed={() => this.props.onclosed()}>
                    <SettingsList inPopover={true} openOptions={this.props.openOptions} onOptionClick={this.onoptionclick} style={{height: '410px'}} />
                </Popover> :
                <Popup className="settings-popup" onPopupClosed={() => this.props.onclosed()}>
                    <SettingsList onOptionClick={this.onoptionclick} openOptions={this.props.openOptions} />
                </Popup>
        )
    }
}

const Settings = props => {
    useEffect(() => {
        if ( Device.phone )
            f7.popup.open('.settings-popup');
        else f7.popover.open('#settings-popover', '#btn-settings');

        return () => {
        }
    });

    const onviewclosed = () => {
        if (props.onclosed) {
            props.onclosed();
        }
    };

    return <SettingsView usePopover={!Device.phone} onclosed={onviewclosed} openOptions={props.openOptions} />
};

export default Settings;