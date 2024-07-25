window.setTimeout(function () {
    const e = (e) =>
            Array.prototype.filter.call(e, function (e) {
                return e;
            }),
        t = /<([^>]+?)([^>]*?)>(.*?)<\/\1>/gi,
        r = /^ +/gm,
        n = !!document.getElementById("kl_wrapper_3") && document.getElementById("kl_wrapper_3");
	if (location.href.split('/').length>4 && n.classList!=undefined){
    if (n.classList.contains("dvreditor")) {
        console.log("dvreditor t");
        const t = !!document.querySelectorAll(".user_content") && e(document.querySelectorAll(".user_content"));
        t &&
            window.location.href.indexOf("discussion_topics") <= -1 &&
            t.forEach((e) => {
                e.classList.remove("user_content");
            });
        const r = !!document.querySelectorAll(".page-title") && e(document.querySelectorAll(".page-title"));
        r &&
            r.forEach((e) => {
                e.parentNode.removeChild(e);
            });
        const n = !!document.querySelector("h2.course-title") && document.querySelector("h2.course-title");
        n && n.parentNode.removeChild(n);
        const l = !!document.querySelector(".ic-Action-header__Heading") && document.querySelector(".ic-Action-header__Heading");
        if ((l && l.parentNode.removeChild(l), document.querySelector(".dvraschedule") && document.querySelector(".dvraschedule"))) {
            const e = document.createElement("script");
            (e.src = "https://lms.devry.edu/lms/scripts/assignment_schedule_demo_block.js"), document.head.appendChild(e);
        }
        var o = document.createElement("script");
        (o.src = "https://lms.devry.edu/lms/scripts/syllabus-injection-test.js"), document.head.appendChild(o);
    
	}
	}
    const l = !!document.querySelectorAll(".dvricon") && e(document.querySelectorAll(".dvricon"));
    n &&
        l.length &&
        l.forEach((e) => {
            e.innerHTML = "";
        });
    const c = !!document.querySelectorAll(".dvrmutton__toggle__icon") && e(document.querySelectorAll(".dvrmutton__toggle__icon"));
    c &&
        c.forEach((e) => {
            e.innerHTML = "";
        });
    const i = !!document.querySelectorAll(".dvrladftable") && e(document.querySelectorAll(".dvrladftable"));
    i &&
        i.length > 0 &&
        i.forEach((t) => {
            const r = !!t.querySelectorAll(".dvrladftable__col__body__item__link") && e(t.querySelectorAll(".dvrladftable__col__body__item__link"));
            r &&
                r.length > 0 &&
                r.forEach((t) => {
                    const r = !!t.querySelectorAll("strong") && e(t.querySelectorAll("strong"));
                    r &&
                        r.length > 0 &&
                        r.forEach((e, t) => {
                            /\S/.test(e.innerHTML) || e.remove();
                        });
                });
        });
    const d = !!document.querySelector(".dvrinstructor") && document.querySelector(".dvrinstructor");
    if (d) {
        const n = !!document.querySelector(".kl_user_details") && document.querySelector(".kl_user_details");
        if (n) {
            const o = { avatar: !1, name: !1, title: !1, email: !1 },
                l = !!n.querySelector("img") && n.querySelector("img"),
                c = !!n.querySelectorAll(".kl_user_detail") && e(n.querySelectorAll(".kl_user_detail")),
                i = d.querySelector(".dvrinstructor__avatar"),
                u = d.querySelector(".dvrinstructor__info__name"),
                s = d.querySelector(".dvrinstructor__info__title"),
                a = d.querySelector(".dvrinstructor__info__ctas__email");
            if (l && ((o.avatar = l.getAttribute("src")), (i.innerHTML = ""), "https://devryu.instructure.com/images/messages/avatar-50.png" !== o.avatar)) {
                const e = document.createElement("img");
                e.setAttribute("src", o.avatar), i.appendChild(e);
            }
            if (c) {
                let e = !!c[0] && c[0].innerHTML,
                    n = !!c[1] && c[1].innerHTML,
                    l = !!c[2] && c[2].querySelector("a");
                const i = (e) => e.replace(t, "").replace(r, "");
                (o.name = i(e)), (o.title = i(n)), (o.email = l.innerHTML), (u.innerHTML = o.name), (s.innerHTML = o.title), a.setAttribute("href", `mailto:${o.email}`);
            }
        }
    }
    const u = !!document.getElementById("dvrMuttonOptionsToggle") && document.getElementById("dvrMuttonOptionsToggle"),
        s = !!document.getElementById("dvrMuttonOptionsMenu") && document.getElementById("dvrMuttonOptionsMenu");
    if (u && s) {
        const t = e(n.querySelectorAll('[id^="kl_content_block_"], [id^="kl_objectives_syllabus"]')),
            r = [],
            o = (e, t) => `<a href="#${e}" tabindex="-1" class="dvrmutton__options__option"><span class="dvrmutton__options__option__text">${t}</span></a>`;
        let l = "",
            c = [];
        const i = () => {
            u.setAttribute("tabindex", "0"),
                r.forEach((t, n) => {
                    const i = `${((e) =>
                        e.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (e, t) {
                            return 0 == +e ? "" : 0 === t ? e.toLowerCase() : e.toUpperCase();
                        }))(((e) => e.replace(/[^\w\s]/gi, ""))(t.innerText))}${n}`;
                    t.setAttribute("id", i),
                        (l += o(i, t.innerText)),
                        r.length - 1 === n &&
                            ((s.innerHTML = l),
                            (c = e(s.querySelectorAll(".dvrmutton__options__option"))).forEach((e) => {
                                e.addEventListener("click", (t) => v(t, e));
                            }));
                });
        };
        t.forEach((e, n) => {
            const o = e.querySelector("h2");
            o && r.push(o), t.length - 1 === n && i();
        });
        const d = document.querySelector(".dvrmutton"),
            a = () => {
                u.setAttribute("aria-expanded", "true"),
                    s.setAttribute("aria-hidden", "false"),
                    s.removeAttribute("tabindex"),
                    c.forEach((e) => {
                        e.removeAttribute("tabindex");
                    });
            },
            m = () => {
                u.setAttribute("aria-expanded", "false"),
                    s.setAttribute("aria-hidden", "true"),
                    c.forEach((e) => {
                        e.setAttribute("tabindex", "-1");
                    });
            },
            _ = () => {
                const e = (e) => {
                        !d.contains(e.target) && ((e) => !!e && !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length))(d) && (m(), t());
                    },
                    t = () => {
                        document.removeEventListener("click", e);
                    };
                "false" === u.getAttribute("aria-expanded") ? (a(), document.addEventListener("click", e)) : m();
            },
            y = (e) => {
                "Enter" === e.key && ("false" === u.getAttribute("aria-expanded") ? a() : m());
            },
            v = (e, t) => {
                e.preventDefault(), m(), document.querySelector(t.getAttribute("href")).scrollIntoView({ behavior: "smooth" });
            };
        u.addEventListener("click", _), u.addEventListener("keypress", (e) => y(e));
    }
    window.setTimeout(() => {
        const e = !!document.getElementById("kl_syllabus_nav") && document.getElementById("kl_syllabus_nav");
        e && e.parentNode.removeChild(e);
    }, 900);
}, 900);
