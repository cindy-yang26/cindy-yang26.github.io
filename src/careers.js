let internshipIndex = 0;

const internshipRoles = [
    {
        title: "Frontend Engineering Intern",
        compensation: "Level 4 - Competitive intern pay + meals stipend",
        description: "Build and polish delightful user-facing features for this site, from responsive layout improvements to meaningful interactions.",
        highlights: [
            "Build reusable UI components",
            "Improve page performance and accessibility",
            "Ship polished mobile and desktop experiences",
        ],
    },
    {
        title: "Backend Engineering Intern",
        compensation: "Level 4 - Competitive intern pay + infra stipend",
        description: "Design lightweight APIs and data flows that support internship applications, analytics, and reliable content updates.",
        highlights: [
            "Build Formspree and webhook integrations",
            "Define clean API contracts for future expansion",
            "Set up monitoring for form delivery reliability",
        ],
    },
    {
        title: "LLM Engineering Intern",
        compensation: "Level 5 - Competitive intern pay + model tooling budget",
        description: "Prototype assistant-style features that help personalize this website while preserving quality, safety, and editorial tone.",
        highlights: [
            "Design prompt and retrieval experiments",
            "Evaluate response quality and guardrails",
            "Build simple inference UX integrations",
        ],
    },
    {
        title: "FPGA Intern",
        compensation: "Level 5 - Competitive intern pay + hardware lab budget",
        description: "Explore hardware acceleration concepts that could support future AI and media workloads powering richer product demos.",
        highlights: [
            "Prototype acceleration paths for targeted workloads",
            "Benchmark latency and throughput tradeoffs",
            "Document practical architecture recommendations",
        ],
    },
    {
        title: "Cava Logistics Intern",
        compensation: "Level 6 - Hero intern pay + daily Cava mission bonus",
        description: "Own the critical operation: ensuring Cindy can get Cava every day despite there being no Cava in San Francisco.",
        highlights: [
            "Design an intercity bowl routing strategy",
            "Optimize freshness windows under transit constraints",
            "Build a dashboard that tracks pita-level SLAs",
        ],
    },
];

function renderInternshipCarousel(index) {
    const role = internshipRoles[index];

    if (!role || !carouselTitle || !carouselCompensation || !carouselRoleDescription || !carouselHighlights) {
        return;
    }

    carouselTitle.textContent = role.title;
    carouselCompensation.textContent = role.compensation;
    carouselRoleDescription.textContent = role.description;
    carouselHighlights.innerHTML = role.highlights.map((item) => `<li>${item}</li>`).join("");

    if (carouselDots) {
        carouselDots.querySelectorAll(".carousel-dot").forEach((dot, dotIndex) => {
            dot.classList.toggle("active", dotIndex === index);
            dot.setAttribute("aria-selected", String(dotIndex === index));
        });
    }

    if (internshipForm) {
        const roleSelect = internshipForm.querySelector("#applicantRole");
        if (roleSelect) {
            roleSelect.value = role.title;
        }
    }
}

function moveInternship(step) {
    internshipIndex = (internshipIndex + step + internshipRoles.length) % internshipRoles.length;
    renderInternshipCarousel(internshipIndex);
}

if (carouselDots && internshipRoles.length > 0) {
    carouselDots.innerHTML = internshipRoles
        .map(
            (role, index) =>
                `<button class="carousel-dot" type="button" role="tab" aria-selected="false" aria-label="Show ${role.title}" data-index="${index}">${index + 1}</button>`
        )
        .join("");

    carouselDots.querySelectorAll(".carousel-dot").forEach((dot) => {
        dot.addEventListener("click", () => {
            internshipIndex = Number(dot.dataset.index);
            renderInternshipCarousel(internshipIndex);
        });
    });
}

if (carouselPrev) {
    carouselPrev.addEventListener("click", () => moveInternship(-1));
}

if (carouselNext) {
    carouselNext.addEventListener("click", () => moveInternship(1));
}

if (internshipForm) {
    const roleSelect = internshipForm.querySelector("#applicantRole");
    if (roleSelect) {
        roleSelect.addEventListener("change", () => {
            const selectedIndex = internshipRoles.findIndex((role) => role.title === roleSelect.value);
            if (selectedIndex >= 0) {
                internshipIndex = selectedIndex;
                renderInternshipCarousel(internshipIndex);
            }
        });
    }
}

if (internshipForm) {
    internshipForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!internshipForm.checkValidity()) {
            internshipForm.reportValidity();
            showToast("Please complete the required fields first");
            return;
        }

        const endpoint = internshipForm.getAttribute("action") || "";
        const roleSelect = internshipForm.querySelector("#applicantRole");
        const selectedRole = roleSelect && roleSelect.value ? roleSelect.value : "your selected internship";

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                },
                body: new FormData(internshipForm),
            });

            if (!response.ok) {
                throw new Error("Form submission failed");
            }

            internshipForm.reset();
            showToast(`Application sent for ${selectedRole}`);
        } catch (error) {
            showToast("Could not submit right now. Try again in a moment");
        }
    });
}
