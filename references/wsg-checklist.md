# WSG 1.0 — Complete Checklist

All 80 guidelines from the [W3C Web Sustainability Guidelines 1.0](https://www.w3.org/TR/web-sustainability-guidelines/).

For each guideline, assess: `full` | `partial` | `na` (not applicable) | `gap` (not addressed).

## Category 1: User Experience Design (2.1-2.21)

| ID | Guideline | Status | Detail |
|----|-----------|--------|--------|
| 2.1 | Undertake systemic impacts mapping | | |
| 2.2 | Understand user requirements or constraints, resolving barriers to access | | |
| 2.3 | Research how the product or service is used and its environmental impact | | |
| 2.4 | Minimize non-essential content, interactivity, or journeys | | |
| 2.5 | Ensure that navigation and wayfinding are well-structured | | |
| 2.6 | Design to assist and not to distract | | |
| 2.7 | Avoid being manipulative or deceptive | | |
| 2.8 | Ensure accessibility can coexist with sustainability | | |
| 2.9 | Use a design system for interface consistency | | |
| 2.10 | Provide clear, inclusive content with purpose | | |
| 2.11 | Optimize media to reduce resource use | | |
| 2.12 | Ensure animation is proportionate and easy to control | | |
| 2.13 | Use optimized and appropriate web typography | | |
| 2.14 | Offer suitable alternatives for every format used | | |
| 2.15 | Provide accessible, usable, minimal web forms | | |
| 2.16 | Avoid unwanted notifications | | |
| 2.17 | Reduce the impact of downloadable and physical documents | | |
| 2.18 | Design with mobile-first approach | | |
| 2.19 | Audit and test for bugs or issues requiring resolution | | |
| 2.20 | Provide feedback for successful completion of an action | | |
| 2.21 | Regularly test and maintain compatibility | | |

## Category 2: Web Development (3.1-3.20)

| ID | Guideline | Status | Detail |
|----|-----------|--------|--------|
| 3.1 | Set goals based on performance and energy impact | | |
| 3.2 | Remove unnecessary or redundant information | | |
| 3.3 | Modularize bandwidth-heavy components | | |
| 3.4 | Remove unnecessary code | | |
| 3.5 | Avoid redundancy and duplication in code | | |
| 3.6 | Give third parties the same priority as first parties during assessment | | |
| 3.7 | Ensure code follows good semantic practices | | |
| 3.8 | Defer the loading of non-critical resources | | |
| 3.9 | Provide information to help understand the usefulness of a page | | |
| 3.10 | Use native functions | | |
| 3.11 | Structure metadata for machine readability | | |
| 3.12 | Use sustainability beneficial user preference media queries | | |
| 3.13 | Ensure layouts work for different devices and requirements | | |
| 3.14 | Use standards-based JavaScript and APIs | | |
| 3.15 | Ensure that your code is secure | | |
| 3.16 | Use dependencies appropriately and ensure maintenance | | |
| 3.17 | Include expected and beneficial files | | |
| 3.18 | Use the most efficient solution for your service | | |
| 3.19 | Use the latest stable language version | | |
| 3.20 | Optimize code and developer environments | | |

## Category 3: Hosting, Infrastructure, and Systems (4.1-4.12)

| ID | Guideline | Status | Detail |
|----|-----------|--------|--------|
| 4.1 | Use sustainable hosting | | |
| 4.2 | Optimize caching and support offline access | | |
| 4.3 | Reduce data transfer with compression | | |
| 4.4 | Setup necessary error pages and redirection links | | |
| 4.5 | Avoid maintaining unnecessary virtualized environments or containers | | |
| 4.6 | Automate your infrastructure | | |
| 4.7 | Maintain, back up, and monitor servers regularly | | |
| 4.8 | Ensure that servers are run on a regular upgrade cycle | | |
| 4.9 | Consider the impact and requirements of data processing | | |
| 4.10 | Use Content Delivery Networks (CDNs) appropriately | | |
| 4.11 | Use the most energy-efficient option available | | |
| 4.12 | Store data according to the needs of your users | | |

## Category 4: Business Strategy and Product Management (5.1-5.27)

| ID | Guideline | Status | Detail |
|----|-----------|--------|--------|
| 5.1 | Have an identified sustainability leader | | |
| 5.2 | Establish sustainability targets with clear, measurable goals | | |
| 5.3 | Assign a sustainability budget for your digital product | | |
| 5.4 | Define a clear and specific sustainability plan | | |
| 5.5 | Communicate your environmental policy | | |
| 5.6 | Verify and confirm sustainability claims | | |
| 5.7 | Define sustainability goals and KPIs | | |
| 5.8 | Determine material compliance, regulatory, and legal obligations | | |
| 5.9 | Identify the impact of digital sustainability on other areas | | |
| 5.10 | Create an ethical data strategy for sustainability | | |
| 5.11 | Evaluate future impacts of features before deployment | | |
| 5.12 | Document and share sustainability best practices | | |
| 5.13 | Implement sustainability onboarding guidelines | | |
| 5.14 | Facilitate sustainability training for all employees | | |
| 5.15 | Estimate a product or service's environmental impact | | |
| 5.16 | Define a clear organizational sustainability strategy | | |
| 5.17 | Promote the use of open standards and open source | | |
| 5.18 | Implement a sustainability and privacy-focused data strategy | | |
| 5.19 | Support interoperability | | |
| 5.20 | Promote healthy, sustainable remote work | | |
| 5.21 | Include sustainability in agreements | | |
| 5.22 | Include sustainability goals in recruitment practices | | |
| 5.23 | Ensure responsible, ethical procurement | | |
| 5.24 | Include sustainability in vendor partner agreements | | |
| 5.25 | Share best practices with stakeholders | | |
| 5.26 | Raise awareness and educate communities on sustainability | | |
| 5.27 | Assess and build for user-initiated sustainability | | |

## JSON Template

Create `wsg-report/wsg-compliance.json` with this structure:

```json
{
  "version": "WSG 1.0",
  "spec": "https://www.w3.org/TR/web-sustainability-guidelines/",
  "totalGuidelines": 80,
  "date": "YYYY-MM-DD",
  "summary": {
    "full": 0,
    "partial": 0,
    "total": 0
  },
  "categories": [
    {
      "name": "User Experience Design",
      "icon": "\ud83c\udfa8",
      "range": "2.1\u20132.21",
      "description": "Guidelines 2.1\u20132.21 \u2014 efficient, inclusive, minimal UX.",
      "guidelines": [
        {
          "id": "2.2",
          "title": "Understand user requirements or constraints",
          "status": "full",
          "detail": "Explanation of how your project addresses this."
        }
      ]
    },
    {
      "name": "Web Development",
      "icon": "\u2699\ufe0f",
      "range": "3.1\u20133.20",
      "description": "Guidelines 3.1\u20133.20 \u2014 efficient, secure, standards-based code.",
      "guidelines": []
    },
    {
      "name": "Hosting, Infrastructure, and Systems",
      "icon": "\ud83c\udf10",
      "range": "4.1\u20134.12",
      "description": "Guidelines 4.1\u20134.12 \u2014 sustainable hosting, caching, compression.",
      "guidelines": []
    },
    {
      "name": "Business Strategy and Product Management",
      "icon": "\ud83d\udccb",
      "range": "5.1\u20135.27",
      "description": "Guidelines 5.1\u20135.27 \u2014 privacy, transparency, ethical practices.",
      "guidelines": []
    }
  ]
}
```

## Effort Estimation Guide

When proposing actions for `gap` guidelines:

| Effort | Definition | Examples |
|--------|-----------|---------|
| **Trivial** | < 1 hour, config change | Add meta tag, enable compression, add robots.txt |
| **Small** | 1-4 hours, focused change | Switch to system fonts, add lazy loading, add alt text |
| **Medium** | 1-2 days, architectural | Code splitting, service worker, dark mode support |
| **Large** | 1+ week, significant | Full accessibility remediation, SCI profiler integration |

## References

- [W3C Web Sustainability Guidelines 1.0](https://www.w3.org/TR/web-sustainability-guidelines/)
- [Web Almanac Sustainability Chapter](https://almanac.httparchive.org/en/2022/sustainability)
- [Sustainable Web Design (Tom Greenwood)](https://sustainablewebdesign.org/)
