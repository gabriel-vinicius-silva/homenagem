document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // =========================================================
    // ELEMENTOS PRINCIPAIS
    // =========================================================

    const envelopeScreen = document.getElementById("envelope-screen");
    const envelope = document.getElementById("envelope");
    const openEnvelopeButton = document.getElementById("open-envelope");
    const mainContent = document.getElementById("main-content");
    const memoryMenu = document.getElementById("memory-menu");

    let envelopeOpened = false;


    // =========================================================
    // FUNÇÕES AUXILIARES
    // =========================================================

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    function createParticle(x, y, type = "heart") {
        const particle = document.createElement("span");

        particle.className = `love-particle ${type}`;

        particle.textContent =
            type === "spark" ? "✦" : "♥";

        particle.style.position = "fixed";
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.pointerEvents = "none";
        particle.style.zIndex = "9999";

        const size = Math.random() * 12 + 8;

        particle.style.fontSize = `${size}px`;

        const moveX =
            (Math.random() - 0.5) * 180;

        const moveY =
            -(Math.random() * 180 + 80);

        particle.style.setProperty(
            "--move-x",
            `${moveX}px`
        );

        particle.style.setProperty(
            "--move-y",
            `${moveY}px`
        );

        document.body.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 1800);
    }


    function createParticles(amount = 20) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        for (let i = 0; i < amount; i++) {

            setTimeout(() => {

                createParticle(
                    centerX +
                    (Math.random() - 0.5) * 250,

                    centerY +
                    (Math.random() - 0.5) * 150
                );

            }, i * 35);
        }
    }


    function createHeartExplosion(amount = 45) {

        const button =
            document.getElementById("yes-button");

        let centerX =
            window.innerWidth / 2;

        let centerY =
            window.innerHeight / 2;

        if (button) {

            const rect =
                button.getBoundingClientRect();

            centerX =
                rect.left + rect.width / 2;

            centerY =
                rect.top + rect.height / 2;
        }

        for (let i = 0; i < amount; i++) {

            setTimeout(() => {

                createParticle(
                    centerX +
                    (Math.random() - 0.5) * 120,

                    centerY +
                    (Math.random() - 0.5) * 80
                );

            }, i * 25);
        }
    }


    // =========================================================
    // ABRIR ENVELOPE
    // =========================================================

    async function openLoveLetter() {

        if (envelopeOpened) return;

        envelopeOpened = true;

        // Abre o envelope
        if (envelope) {
            envelope.classList.add("open");
        }

        // Explosão inicial
        createParticles(25);

        // Pequena pausa para a animação
        await wait(900);

        // Esconde a tela do envelope
        if (envelopeScreen) {

            envelopeScreen.style.transition =
                "opacity 1.5s ease, transform 1.5s ease";

            envelopeScreen.style.opacity = "0";
            envelopeScreen.style.transform =
                "scale(1.04)";
        }

        await wait(1500);

        // Remove completamente a tela inicial
        if (envelopeScreen) {
            envelopeScreen.classList.remove("active");
            envelopeScreen.classList.add("hidden");
            envelopeScreen.style.pointerEvents = "none";
        }

        // Mostra o conteúdo
        if (mainContent) {
            mainContent.classList.remove("hidden");
            mainContent.style.display = "";
        }

        // Libera o scroll
        document.body.style.overflowY = "auto";
        document.body.style.overflowX = "hidden";

        // Ativa introdução
        const intro =
            document.getElementById("intro");

        if (intro) {
            intro.classList.add("reveal");
        }

        // Mostra menu de memórias
        if (memoryMenu) {
            memoryMenu.classList.remove("hidden");
            memoryMenu.classList.add("visible");
        }

        // Volta para o topo
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    if (openEnvelopeButton) {

        openEnvelopeButton.addEventListener(
            "click",
            openLoveLetter
        );
    }


    if (envelope) {

        envelope.addEventListener(
            "click",
            () => {

                if (!envelopeOpened) {
                    openLoveLetter();
                }

            }
        );
    }


    // =========================================================
    // BOTÕES "CONTINUAR"
    // =========================================================

    const nextButtons =
        document.querySelectorAll("[data-next]");


    nextButtons.forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();

            const targetId =
                button.getAttribute("data-next");

            if (!targetId) return;

            const target =
                document.getElementById(targetId);

            if (!target) {
                console.warn(
                    `Seção "${targetId}" não encontrada.`
                );

                return;
            }

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });


    // =========================================================
    // ANIMAÇÃO DAS SEÇÕES
    // =========================================================

    const storySections =
        document.querySelectorAll(".story-section");


    if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "reveal"
                            );

                        }

                    });

                },
                {
                    threshold: 0.15
                }
            );


        storySections.forEach(section => {

            revealObserver.observe(section);

        });

    } else {

        storySections.forEach(section => {

            section.classList.add("reveal");

        });

    }


    // =========================================================
    // CONTADOR DESDE O PRIMEIRO BEIJO
    // 16 DE AGOSTO DE 2026
    // =========================================================

    const counterDays =
        document.getElementById("counter-days");

    const counterHours =
        document.getElementById("counter-hours");

    const counterMinutes =
        document.getElementById("counter-minutes");

    const counterSeconds =
        document.getElementById("counter-seconds");


    // Horário não informado.
    // Referência: 16/08/2026 às 00:00.
    const firstKissDate =
        new Date(2026, 7, 16, 0, 0, 0);


    function updateCounter() {

        const now = new Date();

        let difference =
            now.getTime() -
            firstKissDate.getTime();


        // Se ainda não chegou à data,
        // mantém o contador em zero.
        if (difference < 0) {
            difference = 0;
        }


        const totalSeconds =
            Math.floor(difference / 1000);


        const days =
            Math.floor(
                totalSeconds / 86400
            );


        const hours =
            Math.floor(
                (totalSeconds % 86400) /
                3600
            );


        const minutes =
            Math.floor(
                (totalSeconds % 3600) /
                60
            );


        const seconds =
            totalSeconds % 60;


        if (counterDays) {

            counterDays.textContent =
                String(days).padStart(2, "0");

        }


        if (counterHours) {

            counterHours.textContent =
                String(hours).padStart(2, "0");

        }


        if (counterMinutes) {

            counterMinutes.textContent =
                String(minutes).padStart(2, "0");

        }


        if (counterSeconds) {

            counterSeconds.textContent =
                String(seconds).padStart(2, "0");

        }

    }


    updateCounter();


    setInterval(
        updateCounter,
        1000
    );


    // =========================================================
    // MÚSICA
    // =========================================================

    const musicButton =
        document.getElementById("music-play");

    const loveSong =
        document.getElementById("love-song");


    if (musicButton && loveSong) {

        musicButton.addEventListener(
            "click",
            async () => {

                try {

                    if (loveSong.paused) {

                        await loveSong.play();

                        musicButton.textContent =
                            "⏸";

                        musicButton.setAttribute(
                            "aria-label",
                            "Pausar música"
                        );

                        musicButton.classList.add(
                            "playing"
                        );

                    } else {

                        loveSong.pause();

                        musicButton.textContent =
                            "▶";

                        musicButton.setAttribute(
                            "aria-label",
                            "Tocar música"
                        );

                        musicButton.classList.remove(
                            "playing"
                        );
                    }

                } catch (error) {

                    console.warn(
                        "Não foi possível reproduzir a música.",
                        error
                    );

                }

            }
        );


        loveSong.addEventListener(
            "ended",
            () => {

                musicButton.textContent =
                    "▶";

                musicButton.setAttribute(
                    "aria-label",
                    "Tocar música"
                );

                musicButton.classList.remove(
                    "playing"
                );

            }
        );

    }


    // =========================================================
    // GALERIA DE FOTOS
    // =========================================================

    const photoCards =
        document.querySelectorAll(".photo-card");


    photoCards.forEach(card => {

        card.addEventListener(
            "click",
            () => {

                photoCards.forEach(
                    otherCard => {

                        if (otherCard !== card) {

                            otherCard.classList.remove(
                                "photo-focus"
                            );

                        }

                    }
                );


                card.classList.toggle(
                    "photo-focus"
                );

            }
        );

    });


    // =========================================================
    // MENSAGENS SECRETAS
    // =========================================================

    const secretStars =
        document.querySelectorAll(".secret-star");

    const secretModal =
        document.getElementById("secret-modal");

    const secretMessage =
        document.getElementById("secret-message");

    const closeModal =
        document.getElementById("close-modal");


    function openSecretMessage(star) {

        if (!secretModal || !secretMessage) {
            return;
        }


        const message =
            star.getAttribute("data-message") ||
            "Você encontrou um pedacinho secreto da nossa história. ❤️";


        secretMessage.textContent =
            message;


        // IMPORTANTE:
        // remove hidden antes de adicionar active
        secretModal.classList.remove(
            "hidden"
        );

        secretModal.classList.add(
            "active"
        );


        document.body.classList.add(
            "modal-open"
        );


        createParticles(12);

    }


    function closeSecretMessage() {

        if (!secretModal) {
            return;
        }


        secretModal.classList.remove(
            "active"
        );


        // Espera a animação antes de esconder
        setTimeout(() => {

            if (
                !secretModal.classList.contains(
                    "active"
                )
            ) {

                secretModal.classList.add(
                    "hidden"
                );

            }

        }, 300);


        document.body.classList.remove(
            "modal-open"
        );

    }


    secretStars.forEach(star => {

        star.addEventListener(
            "click",
            () => {

                openSecretMessage(star);

            }
        );

    });


    if (closeModal) {

        closeModal.addEventListener(
            "click",
            closeSecretMessage
        );

    }


    if (secretModal) {

        secretModal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    secretModal
                ) {

                    closeSecretMessage();

                }

            }
        );

    }


    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                closeSecretMessage();

            }

        }
    );


    // =========================================================
    // MENU DE MEMÓRIAS
    // =========================================================

    if (memoryMenu) {

        memoryMenu.addEventListener(
            "click",
            () => {

                const gallery =
                    document.getElementById(
                        "gallery"
                    );


                if (!gallery) {
                    return;
                }


                gallery.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    }


    // =========================================================
    // ANIMAÇÃO DA CARTA
    // =========================================================

    const letterSection =
        document.getElementById("letter");


    if (
        letterSection &&
        "IntersectionObserver" in window
    ) {

        const letterObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            letterSection.classList.add(
                                "letter-writing"
                            );

                        }

                    });

                },
                {
                    threshold: 0.25
                }
            );


        letterObserver.observe(
            letterSection
        );

    }


    // =========================================================
    // SURPRESA FINAL
    // =========================================================

    const finalSurprise =
        document.getElementById(
            "final-surprise"
        );


    if (
        finalSurprise &&
        "IntersectionObserver" in window
    ) {

        let finalActivated = false;


        const finalObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting &&
                            !finalActivated
                        ) {

                            finalActivated =
                                true;

                            finalSurprise.classList.add(
                                "final-active"
                            );

                            createParticles(18);

                        }

                    });

                },
                {
                    threshold: 0.3
                }
            );


        finalObserver.observe(
            finalSurprise
        );

    }


    // =========================================================
    // PERGUNTA FINAL
    // =========================================================

    const yesButton =
        document.getElementById(
            "yes-button"
        );

    const sureButton =
        document.getElementById(
            "sure-button"
        );

    const finalAnswer =
        document.getElementById(
            "final-answer"
        );


    function showFinalAnswer() {

        if (!finalAnswer) {
            return;
        }


        // Remove o hidden para permitir que apareça
        finalAnswer.classList.remove(
            "hidden"
        );


        finalAnswer.classList.add(
            "show"
        );


        createHeartExplosion(45);


        // Desabilita os botões depois da resposta
        if (yesButton) {

            yesButton.disabled = true;

        }


        if (sureButton) {

            sureButton.disabled = true;

        }


        setTimeout(() => {

            finalAnswer.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }, 250);

    }


    if (yesButton) {

        yesButton.addEventListener(
            "click",
            showFinalAnswer
        );

    }


    if (sureButton) {

        sureButton.addEventListener(
            "click",
            showFinalAnswer
        );

    }


    // =========================================================
    // EFEITO DE BRILHO AO CLICAR
    // =========================================================

    document.addEventListener(
        "pointerdown",
        event => {

            const target =
                event.target;


            if (
                target.closest("button") ||
                target.closest(".envelope") ||
                target.closest("a")
            ) {

                return;

            }


            createParticle(
                event.clientX,
                event.clientY,
                "spark"
            );

        }
    );


    // =========================================================
    // PARALLAX DO FUNDO
    // =========================================================

    const stars =
        document.querySelector(".stars");

    const particlesBackground =
        document.querySelector(
            ".particles"
        );


    window.addEventListener(
        "scroll",
        () => {

            const scrollY =
                window.scrollY;


            if (stars) {

                stars.style.transform =
                    `translateY(${scrollY * 0.08}px)`;

            }


            if (particlesBackground) {

                particlesBackground.style.transform =
                    `translateY(${scrollY * 0.03}px)`;

            }

        },
        {
            passive: true
        }
    );


    // =========================================================
    // ACESSIBILIDADE
    // =========================================================

    if (openEnvelopeButton) {

        openEnvelopeButton.setAttribute(
            "aria-label",
            "Abrir minha carta de amor"
        );

    }


    if (musicButton) {

        musicButton.setAttribute(
            "aria-label",
            "Tocar música"
        );

    }


    // =========================================================
    // PREVINE SCROLL DO FUNDO COM MODAL ABERTO
    // =========================================================

    function updateModalScroll() {

        if (
            document.body.classList.contains(
                "modal-open"
            )
        ) {

            document.body.style.overflow =
                "hidden";

        } else if (envelopeOpened) {

            document.body.style.overflowY =
                "auto";

            document.body.style.overflowX =
                "hidden";

        }

    }


    const modalObserver =
        new MutationObserver(
            updateModalScroll
        );


    if (secretModal) {

        modalObserver.observe(
            secretModal,
            {
                attributes: true,
                attributeFilter: ["class"]
            }
        );

    }


    // =========================================================
    // EASTER EGG
    // =========================================================

    console.log(
        "%c❤️ Gabriel + Ana Paula ❤️",
        "font-size: 22px; font-weight: bold;"
    );

    console.log(
        "%cAlgumas histórias não precisam de explicação. Elas só precisam ser vividas.",
        "font-size: 14px;"
    );

});