window.GlobalEesy = window.GlobalEesy || {};
window.var_delay_login_until_support_requested = false;
window.var_impact_engine_loaded = false;
window.var_ready_lti_event = undefined;
window.var_public_profiles = [];

delete window.GlobalEesy.ActiveLTIName;
delete window.GlobalEesy.ActiveLTIDomain;

const hostname = window.location.hostname;

window.addEventListener(
    'message',
    (e) => {
        if (e.data.messageName === 'lti.ready' && !window.var_impact_engine_loaded) {
            window.var_ready_lti_event = e;
            e.source.postMessage({ parentLoaderExpected: 'true' }, '*');
        }
    },
    false
);

// Add promise that resolves when support center is initialized.
window.Impact = window.Impact || {};
window.Impact.ready = new Promise((resolve) => {
    window.Impact.readyResolve = resolve;
});

// Open support center when user clicks on any link with ending with: "impact=launch".
// Currently it's connected to custom link in help tab.
document.addEventListener('click', (event) => {
    if (event.target && event.target.closest("a[href$='impact=launch']")) {
        event.preventDefault();

        if (window.Impact.enabled === undefined) {
            // launch legacy support center
            window.dispatchEvent(new Event('eesy_launchSupportTab'));
        } else {
            window.Impact.ready.then(() => {
                window.Impact.show();
                const closeButtonSelector = document.location.pathname.endsWith('/login/canvas')
                    ? 'div.ui-dialog > div.ui-widget-header > button'
                    : '.navigation-tray-container button:first-child';
                document.querySelector(closeButtonSelector)?.click();
            });
        }
    }
});

(async () => {
    function getCurrentCanvasUserId() {
        if (ENV.current_user_id === undefined || ENV.current_user_id === null) return undefined;

        if (document.location.pathname.endsWith('/login/canvas')) return undefined;

        return ENV.current_user_id;
    }

    function getCurrentCanvasLocale() {
        if (ENV.BIGEASY_LOCALE === undefined || ENV.BIGEASY_LOCALE === null) return undefined;

        return ENV.BIGEASY_LOCALE;
    }

    function hasActiveExpertSession() {
        if (!launchSettings.supportNonAuthorizedUsers) return false;

        if (window.sessionStorage.eesysoft_session_key === undefined) return false;

        return sessionStorage.eesy_isExpert === 'true';
    }

    function clearSessionStorage() {
        sessionStorage.removeItem('eesysoft_session_key');
        sessionStorage.removeItem('eesysoft_active_user_id');
        sessionStorage.removeItem('eesysoft_active_locale');
    }

    function refreshSessionId() {
        // 'eesysoft_session' value is used as a query param in some requests to manage cache.
        // We want to refresh this value when user logs in or logs out
        const previousUserId = Number(sessionStorage.getItem('eesysoft_active_user_id'));
        const currentUserId = Number(getCurrentCanvasUserId());
        if (!currentUserId || previousUserId !== currentUserId) {
            sessionStorage.removeItem('eesysoft_session');
        }
    }

    // Returns the element (such as <iframe> or <object>) in which the window is embedded,
    // or null if the element is either top-level or is embedded into a document with a different script origin.
    if (window.frameElement) return;

    // Launching support center on 2FA page messes with some cookies and whole things brakes.
    // There is also no point in launching support center there.
    // @todo: probably should be done on Canvas side
    if (document.location.href.endsWith('/login/otp')) return;

    // We need to make sure to clear information about earlier Impact logins...Even when the
    // user is entering via SSO
    if (window.location.search.includes('login_success=')) {
        clearSessionStorage();
    }

    document.addEventListener('engineLoaded', () => {
        window.var_impact_engine_loaded = true;

        if (window.var_ready_lti_event !== undefined) {
            createCustomEvent('ltiLoadEngine', { detail: { event: window.var_ready_lti_event } });
            window.var_ready_lti_event = undefined;
        }

        function handleExternalToolUrl(href) {
            const match = href.match('^/courses/([0-9]+)/');
            const courseId = match ? match[1] : undefined;
            const ltiId = resolveActiveLtiId(href);

            if (ltiId) {
                createCustomEvent('registerLtiLaunch', {
                    detail: { launchType: 'LTI_LAUNCH', data: ltiId, courseId: courseId },
                });
            } else if (href.indexOf('external_tools/retrieve') > -1) {
                createCustomEvent('registerLtiLaunch', {
                    detail: { launchType: 'LTI_LINK_RETRIVE', data: href.split('?')[1], courseId: courseId },
                });
            }
        }

        document.querySelectorAll('a[href*=external_tools]').forEach((link) => {
            link.addEventListener('click', () => {
                try {
                    handleExternalToolUrl(link.href);
                } catch (err) {
                    // Swallow errors
                }
            });
        });

        document.querySelectorAll('iframe[src*=external_tools\\/retrieve]').forEach((iframe) => {
            const match = document.location.pathname.match('^/courses/([0-9]+)/');
            const courseId = match ? match[1] : undefined;
            createCustomEvent('registerLtiLaunch', {
                detail: {
                    launchType: 'LTI_EMBED_RETRIVE',
                    data: new URL(new URL(iframe.src).searchParams.get('url')).host,
                    courseId: courseId,
                },
            });
        });

        handleExternalToolUrl(document.location.pathname);
    });

    const cfg = window.eesyLaunchConfig || {};
    window.sessionStorage.eesysoft_lms_type = 'canvas';

    const [launchSettings, salesforceAccountId] = await Promise.all([getLaunchSettings(), getSalesforceAccountId()]);

    if (launchSettings.virtualAssistant && !window._chatBotReady) {
        // Skip if legacy launching script already loaded chatbot frontend (_chatBotReady promise).
        window.Impact.enabled = true;

        function getChatbotBundleURL() {
            // Select production or staging version of frontend
            // @todo: move this to env vars and provide in launchSettings
            switch (document.location.host) {
                case 'chatbotstaging.instructure.com':
                case 'chatbot-dev.instructure.com':
                case 'chatbot.beta.instructure.com':
                    return 'https://dt5vio76voyqa.cloudfront.net/main.js';
                default:
                    return 'https://d1embgbpmfo5b.cloudfront.net/main.js';
            }
        }

        // Create promise to sync loading chatbot bundle with initialization.
        window._chatBotReady = (async () => {
            await loadScript(getChatbotBundleURL());
            // Entry file loaded, now wait for main bundle.
            await window._chatBotBundleReady;
        })();
    }
    sessionStorage.eesysoft_active_account_id = await getActiveCanvasAccount();

    if (ENV.COURSE_ID === undefined) {
        const match = document.location.pathname.match('^/courses/([0-9]+)/');
        if (match && match[1]) {
            window.eesy_course_id = match[1];
        }
    } else {
        window.eesy_course_id = ENV.COURSE_ID;
    }

    await handleLtiTools();

    handleEesySoftUser();

    function getLaunchSettings() {
        return getJSON(
            getEesyServerURL('/rest/public/canvasLaunchSettings', {
                _: sessionStorage.eesysoft_session || Date.now().valueOf(),
            })
        );
    }

    async function getSalesforceAccountId() {
        return (await getJSON('/api/v1/impact/data')).account.salesforce_id;
    }

    async function handleLtiTools() {
        const activeLtiId = resolveActiveLtiId(document.location.pathname);

        if (!activeLtiId) {
            return;
        }
        try {
            const toolInfo = await getJSON(
                `/api/v1/accounts/${ENV.DOMAIN_ROOT_ACCOUNT_ID}/external_tools/${activeLtiId}`
            );
            const states = [];
            if (toolInfo.name !== null) {
                states.push({ name: 'ActiveLTIName', value: toolInfo.name });
                window.GlobalEesy.ActiveLTIName = { value: toolInfo.name, type: 'state', source: 'page_load' };
            }

            if (toolInfo.domain !== null) {
                states.push({ name: 'ActiveLTIDomain', value: toolInfo.domain });
                window.GlobalEesy.ActiveLTIDomain = {
                    value: toolInfo.domain,
                    type: 'state',
                    source: 'page_load',
                };
            }

            if (states.length > 0) {
                postEesyServer('/rest/public/canvasLtiInfo', {
                    states: JSON.stringify(states),
                    lti_id: toolInfo.id,
                    lti_name: toolInfo.name,
                    lti_description: toolInfo.description,
                    lti_url: toolInfo.url,
                    lti_icon: toolInfo.icon_url,
                    lti_launch_new_window: 0,
                });
            }
        } catch (e) {
            getLtiDomainFallback(activeLtiId);
        }
    }

    function getLtiDomainFallback(activeLtiId) {
        if (ENV.LTI_LAUNCH_RESOURCE_URL) {
            const activeLtiDomain = ENV.LTI_LAUNCH_RESOURCE_URL.split('://').slice(-1)[0].split('/')[0];
            window.GlobalEesy.ActiveLTIDomain = { value: activeLtiDomain, type: 'state', source: 'page_load' };

            postEesyServer('/rest/public/canvasLtiInfo', {
                states: JSON.stringify([{ name: 'ActiveLTIDomain', value: activeLtiDomain }]),
                lti_id: activeLtiId,
                lti_url: ENV.LTI_LAUNCH_RESOURCE_URL.split('?')[0],
            });
        }
    }

    async function handleEesySoftUser() {
        refreshSessionId();
        if (getCurrentCanvasUserId() === undefined && hasActiveExpertSession()) {
            launchEesySoft();
        } else if (getCurrentCanvasUserId() === undefined) {
            clearSessionStorage();

            if (launchSettings.supportNonAuthorizedUsers) {
                if (launchSettings.virtualAssistant) {
                    if (await loginTempUser(launchSettings)) {
                        launchEesySoft();
                    }
                } else {
                    window.var_delay_login_until_support_requested = true;
                    await setNonAuthorizedUserVariables(launchSettings, cfg.host, getNonAuthorizedRoles());
                    loadLoaderJS();
                }
            }
        } else if (
            (window.sessionStorage.eesysoft_session_key &&
                window.sessionStorage.eesysoft_active_user_id === getCurrentCanvasUserId() &&
                window.sessionStorage.eesysoft_active_locale === getCurrentCanvasLocale()) ||
            document.querySelector('.is-masquerading-or-student-view') !== null
        ) {
            launchEesySoft();
        } else {
            if (launchSettings.impactLight) {
                window.var_delay_login_until_support_requested = true;
                await setNonAuthorizedUserVariables(launchSettings, cfg.host, getLightRoles());
                loadLoaderJS();
            } else {
                if (await loginUser(launchSettings, getRoles, false)) {
                    launchEesySoft();
                }
            }
        }
    }

    async function loginUser(launchSettings, getRolesFunc) {
        const getToken = () => postCanvas('/api/v1/jwts?workflows[]=impact');
        const [token, roles] = await Promise.all([getToken(), getRolesFunc(launchSettings)]);

        return loginUserCommon(launchSettings, roles, {
            token: token.token,
        });
    }

    async function loginTempUser(launchSettings) {
        const roles = getNonAuthorizedRoles();

        return loginUserCommon(launchSettings, roles, {
            non_authorized: true,
            host: hostname,
        });
    }

    async function loginUserCommon(launchSettings, roles, extraParams) {
        const userPrefix = launchSettings.hostAsUserPrefix ? `${hostname}_` : '';

        const params = {
            userPrefix: userPrefix,
            locale: ENV.BIGEASY_LOCALE,
            rolesExtended: JSON.stringify(roles),
            key: cfg.key,
            ...extraParams,
        };
        const key = await postEesyServer('/UserLogin.jsp', params);

        const trimmedKey = key.trim();
        if (trimmedKey) {
            window.sessionStorage.eesysoft_session_key = trimmedKey;
            window.sessionStorage.eesysoft_active_user_id = getCurrentCanvasUserId();
            window.sessionStorage.eesysoft_active_locale = getCurrentCanvasLocale();
            window.var_key = trimmedKey;

            return true;
        }

        return false;
    }

    async function getSessionAccess(roles) {
        const result = {};

        function addAccess(id, type) {
            result[`${id}:${type}`] = { enabled: true, rolename: '' };
        }

        addAccess(-1, 0);
        addAccess(-5, 0);

        const requests = roles.map((role) => {
            const params = { name: role.id, profile_type: role.type, static: 'true', __dbc: var_eesy_dbUpdateCount };

            if (role.caption) {
                params.caption = role.caption;
            }

            if (role.is_public) {
                params.is_public = true;
            }

            return getJSON(getEesyServerURL('/rest/public/profile', params));
        });

        (await Promise.all(requests)).forEach((response) => {
            addAccess(response.id, 1);
            if (response.category != null) {
                addAccess(response.category, 0);
            }
            if (response.public) {
                window.var_public_profiles.push(response.id);
            }
        });

        return result;
    }

    function getLng() {
        return getJSON(getEesyServerURL('/rest/public/language/id', { locale: ENV.BIGEASY_LOCALE }));
    }

    async function setNonAuthorizedUserVariables(launchSettings, host, roles) {
        window.var_eesy_build = launchSettings.build_number;
        window.var_eesy_dbUpdateCount = launchSettings.dbUpdateCount;
        window.var_eesy_style_checksum = launchSettings.styleChecksum;
        window.var_eesy_sac = await getSessionAccess(roles); //populate
        window.var_eesy_styles = [];
        window.var_expert_language = undefined;
        window.var_dashboard_url = `https://${host}`;
        window.var_style_path = `https://${host}/resources`;
        window.var_key = '';
        window.var_loadfile = `https://${host}/loadFile`;
        window.var_ltiEngineIsPresent = false;
        window.var_eesy_userUpdated = undefined;
        window.var_show_tab_initial = true;
        window.var_show_tab = true;
        window.var_uefMode = false;
        window.var_uefModeOriginal = false;
        window.var_uefModeOriginalUseUefSupportCenter = false;
        window.isUefOriginalSupportCenter = false;
        window.var_loadExpertTool = false;
        window.var_isExpertToolChromePlugin = false;
        window.eesyTemplates;
        window.waitforload = false;
        window.supportTabMinimized = undefined;
        window.doNotLoadEngineForUserAgentPattern = 'not_in_use_05231;';
        window.var_isLtiLaunch = false;

        const getRuntimeSettings = () =>
            getJSON(
                getEesyServerURL('/rest/public/runtimeSettings', {
                    static: 'true',
                    u: launchSettings.build_number,
                    s: launchSettings.styleChecksum,
                    _: Math.ceil(Date.now() / 6e4), // changes every 60 seconds
                })
            );

        await Promise.all([getLng(), getRuntimeSettings(), loginTempUser(launchSettings)]).then(
            ([lng, runtimeSettings]) => {
                window.var_language = lng.id;
                window.var_tab_version = runtimeSettings.tabVersion;
                window.var_proactive_version = runtimeSettings.proactiveVersion;
                window.var_proactive_lms = runtimeSettings.proactiveLMS;
                window.var_proactive_dark = runtimeSettings.proactiveDark;
                window.var_open_as_chat = runtimeSettings.openAsChat;
                window.var_moveable_tab = runtimeSettings.movableTab;
                window.scrollbarRightAdjust = runtimeSettings.scrollbarRightAdjust;
                window.supportTabMoveLimit = runtimeSettings.supportTabMoveLimit;
                window.eesy_minimizedTabWidth = runtimeSettings.minimizedTabWidth;
                window.eesy_maximizedTabWidth = runtimeSettings.maximizedTabWidth;
                window.attemptUnobscure = runtimeSettings.attemptUnobscure;
                window.var_eesy_hiddenHelpItems = {};
                window.var_eesy_helpitemsSeen = {};
                window.var_user_map = {}; //populate
                window.var_instance_name = runtimeSettings.instanceName;
            }
        );
    }

    function setRole(roles, role, is_public, role_type, caption, parent_id) {
        roles[role] = {
            id: role,
            type: role_type,
            is_public: is_public,
        };

        if (caption !== undefined) {
            roles[role].caption = caption;
        }

        if (parent_id !== undefined) {
            roles[role].parent_id = parent_id;
        }
    }

    async function getRoles(launchSettings) {
        const coursesWithAccounts = await getJSON('/api/v1/users/self/courses?include=account&per_page=100');
        let coursesWithFilteredAccounts = [];

        if (launchSettings.restrictedToAccount) {
            const requests = coursesWithAccounts.map((courseWithAccount) => {
                const params = {
                    id: courseWithAccount.account.id,
                    host: window.location.hostname,
                    static: 'true',
                    __dbc: launchSettings.dbUpdateCount,
                };

                return getJSON(getEesyServerURL('/rest/public/canvas/account/visibility', params));
            });

            let allowedAccounts = {};

            const accountsVisibility = await Promise.all(requests);
            accountsVisibility.forEach((account) => {
                if (account.visible) allowedAccounts[account.id] = true;
            });

            coursesWithAccounts.forEach((course) => {
                if (course.account && allowedAccounts[course.account.id]) {
                    coursesWithFilteredAccounts.push(course);
                }
            });
        } else {
            coursesWithFilteredAccounts = coursesWithAccounts;
        }

        const roles = {};
        let tmpCurrentUserRoles = [...ENV.current_user_roles];

        if (tmpCurrentUserRoles.indexOf('teacher') > -1)
            tmpCurrentUserRoles.splice(tmpCurrentUserRoles.indexOf('teacher'), 1);

        if (launchSettings.hostAsRolePrefix) {
            setRole(roles, hostname, false, 'system');
        }

        coursesWithFilteredAccounts.forEach((course) => {
            if (!launchSettings.ignoreExternalRoles || course.account_id < 1000000000) {
                if (course.account_id === null) {
                    return;
                }

                const rolePrefix = launchSettings.hostAsRolePrefix ? `${hostname}_` : '';
                const courseAccountId = `CourseAccountId_${course.account_id}`;
                const fullAccountId = [rolePrefix, courseAccountId].join('');
                const caption = course.account && course.account.name ? course.account.name : undefined;
                const parentId =
                    course.account && course.account.parent_account_id
                        ? `${rolePrefix}CourseAccountId_${course.account.parent_account_id}`
                        : undefined;

                setRole(roles, fullAccountId, false, 'account', caption, parentId);

                (course.enrollments || []).forEach((enrollment) => {
                    // type teacher, role = teacherEnrollment,taEnrollment,designerEnrollment
                    setRole(roles, enrollment.type, false, 'role');
                    setRole(roles, enrollment.role, false, 'role');

                    if (tmpCurrentUserRoles.indexOf(enrollment.type) < 0) {
                        tmpCurrentUserRoles.push(enrollment.type);
                    }

                    if (launchSettings.hostAsRolePrefix) {
                        setRole(
                            roles,
                            `${salesforceAccountId}_${enrollment.type}`,
                            false,
                            'role',
                            `${enrollment.type} - ${hostname}`,
                            hostname
                        );
                    }

                    setRole(roles, enrollment.role, false, 'role');
                    setRole(
                        roles,
                        `${fullAccountId}_${enrollment.type}`,
                        false,
                        'course_role',
                        enrollment.type,
                        fullAccountId
                    );
                    setRole(
                        roles,
                        `${fullAccountId}_${enrollment.role}`,
                        false,
                        'course_role',
                        enrollment.role,
                        fullAccountId
                    );
                });
            }
        });

        tmpCurrentUserRoles.forEach((role) => {
            setRole(roles, role, false, 'role');
            if (launchSettings.hostAsRolePrefix) {
                setRole(roles, `${hostname}_${role}`, false, 'host_role', undefined, hostname);
                setRole(roles, `${salesforceAccountId}_${role}`, false, 'role', `${role} - ${hostname}`, hostname);
            }
        });

        const primaryRole = getPrimaryRole(tmpCurrentUserRoles);
        setRole(roles, `primary_${primaryRole.role}`, false, 'role', 'Primary ' + primaryRole.name);
        if (launchSettings.hostAsRolePrefix) {
            setRole(
                roles,
                `${hostname}_primary_${primaryRole.role}`,
                false,
                'role',
                `${hostname} Primary ${primaryRole.name}`,
                hostname
            );
        }

        return Object.values(roles);
    }

    function getPrimaryRole(currentUserRoles) {
        const primaryRoles = {
            user: { score: 1, name: 'User' },
            observer: { score: 2, name: 'Observer' },
            student: { score: 3, name: 'Student' },
            designer: { score: 4, name: 'Designer' },
            ta: { score: 5, name: 'Teaching Assistant' },
            teacher: { score: 6, name: 'Teacher' },
            admin: { score: 7, name: 'Administrator' },
            root_admin: { score: 8, name: 'Root Administrator' },
        };

        let highestRole = 'user';
        currentUserRoles.forEach((role) => {
            if (primaryRoles[role] !== undefined) {
                if (primaryRoles[role].score > primaryRoles[highestRole].score) {
                    highestRole = role;
                }
            }
        });

        return {
            role: highestRole,
            name: primaryRoles[highestRole].name,
        };
    }

    function getNonAuthorizedRoles() {
        const roles = {};

        setRole(roles, 'non_authorized', true, 'role');
        setRole(roles, `${hostname}_non_authorized`, true, 'host_role', undefined, hostname);
        setRole(
            roles,
            `${salesforceAccountId}_non_authorized`,
            true,
            'role',
            `Non Authorized users: ${hostname}`,
            hostname
        );
        return Object.values(roles);
    }

    function getLightRoles() {
        const roles = {};

        setRole(roles, hostname, false, 'system');

        ENV.current_user_roles.forEach((role) => {
            setRole(roles, role, false, 'role');
            setRole(roles, `${hostname}_${role}`, false, 'host_role', undefined, hostname);
            setRole(roles, `${salesforceAccountId}_${role}`, false, 'role', `${role}${hostname}`, hostname);
        });

        return Object.values(roles);
    }

    function loadLoaderJS() {
        const path = sessionStorage?.USE_EESY_REQUIRE === 'true' ? '/loader.js' : '/v2/dist/loader.js';
        return loadScript(getEesyServerURL(path, { __bn: var_eesy_build }));
    }

    function launchEesySoft() {
        return loadScript(
            getEesyServerURL('/loader.jsp', {
                smtp: new Date().getTime(),
                showquicklink: cfg.supportTab,
                k: window.sessionStorage.eesysoft_session_key,
            })
        );
    }

    function loadScript(url) {
        return new Promise((resolve) => {
            const scriptTag = document.createElement('script');

            scriptTag.src = url;
            scriptTag.async = true;
            scriptTag.type = 'text/javascript';

            scriptTag.addEventListener('load', resolve);

            document.head.append(scriptTag);
        });
    }

    async function getJSON(url) {
        const res = await fetch(url);
        return res.json();
    }

    async function postCanvas(path, data) {
        const res = await fetch(path, {
            headers: {
                'x-csrf-token': getCSRFToken(),
            },
            body: data ? JSON.stringify(data) : null,
            method: 'POST',
        });
        return res.json();
    }

    async function postEesyServer(path, data) {
        const res = await fetch(getEesyServerURL(path), {
            method: 'POST',
            body: new URLSearchParams(data),
        });
        return res.text();
    }

    function getEesyServerURL(path, params) {
        return `//${cfg.host}${getURL(path, params)}`;
    }

    function getURL(path, params) {
        const paramsStr = new URLSearchParams(params).toString();

        return [path, paramsStr].filter(Boolean).join('?');
    }

    function getCSRFToken() {
        const tokenPart = document.cookie.split('; ').find((row) => row.startsWith('_csrf_token'));
        if (!tokenPart) {
            console.error('No CSRF token found');
            return null;
        }
        return decodeURIComponent(tokenPart.split('=')[1]);
    }

    function resolveActiveLtiId(fromHref) {
        const externalToolGroups = fromHref.match('^/.*/external_tools/(.*)$');

        // get id from path
        if (externalToolGroups) {
            const externalToolId = externalToolGroups[1];

            return isNaN(externalToolId) ? externalToolId.substr(0, externalToolId.indexOf('?')) : externalToolId;
        }

        const placementUrl = document.querySelector('#ext_outcomes_tool_placement_url')?.value;

        // get id from DOM
        if (placementUrl) {
            const ltiId = placementUrl.substr(placementUrl.lastIndexOf('/') + 1);

            if (!isNaN(ltiId)) return ltiId;
        }

        return undefined;
    }

    function getCourseId() {
        // Canvas doesn't have unified way to store current course id in ENV variable
        const id = ENV.COURSE_ID ?? ENV.course?.id ?? ENV.COURSE?.ID ?? ENV.course_id;
        if (id) {
            return id;
        }
        const [contextName, contextValue] = (ENV.context_asset_string ?? '').split('_');
        if (contextName === 'course') {
            return contextValue;
        }

        return undefined;
    }

    async function getActiveCanvasAccount() {
        if (ENV.ACCOUNT_ID) {
            return ENV.ACCOUNT_ID;
        }
        if (ENV.ACCOUNT?.ID) {
            return ENV.ACCOUNT.ID;
        }
        if (ENV.group?.account_id) {
            return ENV.group.account_id;
        }

        const courseId = getCourseId();
        if (courseId) {
            const previousCourseId = sessionStorage.eesysoft_last_stored_course_id;
            const previousCourseAccountId = sessionStorage.eesysoft_account_id_related_to_last_stored_course_id;

            if (previousCourseId !== courseId) {
                const course = await getJSON(`/api/v1/courses/${courseId}`);
                if (course?.account_id) {
                    sessionStorage.eesysoft_last_stored_course_id = courseId;
                    sessionStorage.eesysoft_account_id_related_to_last_stored_course_id = course.account_id;
                    return course.account_id;
                }
            } else if (previousCourseAccountId) {
                return previousCourseAccountId;
            }
        }

        return -1;
    }
})();
