"use client";

import { useEffect } from 'react';
import { useLocale } from '@/context/LocaleContext';
import { useAccessibility } from '@/context/AccessibilityContext';

export default function PrivacyClient() {
    const { locale } = useLocale();
    const { isEnabled } = useAccessibility();

    const privacyContent = {
        ru: {
            title: "Политика конфиденциальности",
            lastUpdated: "Последнее обновление: ",
            sections: [
                {
                    title: "1. Общие положения",
                    content: "Настоящая Политика конфиденциальности направлена на обеспечение защиты персональных данных, прав и свобод физических лиц при обработке их персональных данных, при использовании сайта адвоката Пидложевича Николая Евстафьевича.."
                },
                {
                    title: "2. Какие персональные данные обрабатываются",
                    content: "Обрабатываются общедоступные персональные данные, распространяемые самим субъектом персональных данных либо с его согласия:\n• Имя, фамилия, отчество\n• Адрес электронной почты\n• Номер телефона"
                },
                {
                    title: "3. Цели обработки персональных данных",
                    content: "Ваши персональные данные используются для:\n• Для связи и общения с Вами\n• Для подготовки проекта договора на оказание юридической помощи, при необходимости.\n• Для учета оказанной юридической помощи по направлениям права."
                },
                {
                    title: "4. Хранение и защита персональных данных",
                    content: "Для хранения и защиты приняты правовые, организационные и технические меры по обеспечению защиты Ваших персональных данных от несанкционированного или случайного доступа к ним,\nизменения, блокирования, копирования, распространения, предоставления, удаления персональных данных, а также от иных неправомерных действий в отношении персональных данных.\nВаши данные хранятся в течение времени оказания юридической помощи, после которого Ваши персональные данные удаляются."
                },
                {
                    title: "5. Ваши права",
                    content: "В случае досрочного прекращения оказания юридической помощи, Вы вправе требовать прекращения обработки ваших персональных данных,\n включая их удаление, путем подачи заявления в письменной форме либо в виде электронного документа на электронную почту\n Email: pidlogevich@gmail.com, либо устным заявлением по телефону +375 (29) 779 88 27. "
                }
            ]
        },
        en: {
            title: "Privacy Policy",
            lastUpdated: "Last updated: ",
            sections: [
                {
                    title: "1. General Provisions",
                    content: "This Privacy Policy is intended to ensure the protection of personal data and the rights and freedoms of individuals when processing their personal data while using the website of lawyer Mykolai Pidlozhevich."
                },
                {
                    title: "2. What Personal Data Is Processed",
                    content: "We process publicly available personal data provided by the data subject or with their consent:\n• First name, last name, patronymic\n• Email address\n• Phone number"
                },
                {
                    title: "3. Purposes of Personal Data Processing",
                    content: "Your personal data is used for:\n• Contacting and communicating with you\n• Preparing a draft legal services agreement, if necessary\n• Accounting for legal assistance provided by areas of law"
                },
                {
                    title: "4. Storage and Protection of Personal Data",
                    content: "Legal, organizational, and technical measures have been taken to protect your personal data from unauthorized or accidental access,\nmodification, blocking, copying, distribution, disclosure, deletion, as well as other unlawful actions in relation to personal data.\nYour data is stored for the duration of legal assistance, after which your personal data is deleted."
                },
                {
                    title: "5. Your Rights",
                    content: "In case of early termination of legal assistance, you have the right to request the termination of the processing of your personal data,\nincluding its deletion, by submitting a written request or an electronic document to the email address\nEmail: pidlogevich@gmail.com, or by making an oral request by phone +375 (29) 779 88 27."
                }
            ]
        },
        by: {
            title: "Палітыка канфідэнцыяльнасці",
            lastUpdated: "Апошняе абнаўленне: ",
            sections: [
                {
                    title: "1. Агульныя палажэнні",
                    content: "Дадзеная Палітыка канфідэнцыяльнасці накіравана на забеспячэнне абароны персанальных дадзеных, правоў і свабод фізічных асоб пры апрацоўцы іх персанальных дадзеных пры выкарыстанні сайта адваката Підлажэвіча Мікалая Яўстаф'евіча."
                },
                {
                    title: "2. Якія персанальныя дадзеныя апрацоўваюцца",
                    content: "Апрацоўваюцца агульнадаступныя персанальныя дадзеныя, якія распаўсюджваюцца самім суб'ектам персанальных дадзеных альбо з яго згоды:\n• Імя, прозвішча, імя па бацьку\n• Адрас электроннай пошты\n• Нумар тэлефона"
                },
                {
                    title: "3. Мэты апрацоўкі персанальных дадзеных",
                    content: "Вашы персанальныя дадзеныя выкарыстоўваюцца для:\n• Для сувязі і зносін з вамі\n• Для падрыхтоўкі праекта дагавора на аказанне юрыдычнай дапамогі, пры неабходнасці\n• Для ўліку аказанай юрыдычнай дапамогі па напрамках права"
                },
                {
                    title: "4. Захаванне і абарона персанальных дадзеных",
                    content: "Для захавання і абароны прыняты прававыя, арганізацыйныя і тэхнічныя меры па забеспячэнні абароны вашых персанальных дадзеных ад несанкцыянаванага або выпадковага доступу да іх,\nзмянення, блакіравання, капіравання, распаўсюджвання, прадастаўлення, выдалення персанальных дадзеных, а таксама ад іншых неправамерных дзеянняў у дачыненні да персанальных дадзеных.\nВашы дадзеныя захоўваюцца на працягу часу аказання юрыдычнай дапамогі, пасля чаго вашы персанальныя дадзеныя выдаляюцца."
                },
                {
                    title: "5. Вашы правы",
                    content: "У выпадку датэрміновага спынення аказання юрыдычнай дапамогі вы маеце права патрабаваць спынення апрацоўкі вашых персанальных дадзеных,\nуключаючы іх выдаленне, шляхам падачы заявы ў пісьмовай форме або ў выглядзе электроннага дакумента на электронную пошту\nEmail: pidlogevich@gmail.com, або вуснай заявы па тэлефоне +375 (29) 779 88 27."
                }
            ]
        }
    };

    const content = privacyContent[locale as keyof typeof privacyContent];

    useEffect(() => {
        if (isEnabled) return; // Skip animations in accessibility mode

        const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
        if (!("IntersectionObserver" in window)) {
            elements.forEach((element) => element.classList.add("is-visible"));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 },
        );

        elements.forEach((element) => observer.observe(element));
        return () => observer.disconnect();
    }, [isEnabled]);

    if (isEnabled) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <h1 className="text-4xl font-bold mb-6">{content.title}</h1>
                <p className="text-xl mb-8">
                    {content.lastUpdated}{new Date().toLocaleDateString(locale === 'ru' ? 'ru-RU' : locale === 'en' ? 'en-US' : 'be-BY')}
                </p>
                
                <div className="space-y-8">
                    {content.sections.map((section, index) => (
                        <section key={index} aria-labelledby={`privacy-section-${index}`}>
                            <h2 id={`privacy-section-${index}`} className="text-2xl font-bold mb-4">{section.title}</h2>
                            <div className="text-xl whitespace-pre-line leading-relaxed">
                                {section.content}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="reveal text-3xl font-bold mb-6 text-foreground" data-reveal>{content.title}</h1>
            <p className="reveal text-sm text-muted-foreground mb-8" data-reveal>
                {content.lastUpdated}{new Date().toLocaleDateString(locale === 'ru' ? 'ru-RU' : locale === 'en' ? 'en-US' : 'be-BY')}
            </p>
            
            <div className="space-y-6">
                {content.sections.map((section, index) => (
                    <div key={index} className="reveal card-base bg-card p-6 border" data-reveal>
                        <h2 className="text-xl font-semibold mb-3 text-foreground">{section.title}</h2>
                        <div className="text-muted-foreground whitespace-pre-line">
                            {section.content}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
