import { HomePage } from '@/components/blocks/homepage';
import { websiteConfig } from '@/config/website';
import {
  faqStructuredData,
  jsonLdScript,
  seo,
  siteStructuredData,
} from '@/lib/seo';
import { m } from '@/locale/paraglide/messages';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  head: () => {
    const title = websiteConfig.metadata?.title ?? '';
    const description = websiteConfig.metadata?.description ?? '';
    const metadata = seo('/', { title, description });
    const faqs = [
      {
        question: m.home_faqs_items_item_1_question(),
        answer: m.home_faqs_items_item_1_answer(),
      },
      {
        question: m.home_faqs_items_item_2_question(),
        answer: m.home_faqs_items_item_2_answer(),
      },
      {
        question: m.home_faqs_items_item_3_question(),
        answer: m.home_faqs_items_item_3_answer(),
      },
      {
        question: m.home_faqs_items_item_4_question(),
        answer: m.home_faqs_items_item_4_answer(),
      },
      {
        question: m.home_faqs_items_item_5_question(),
        answer: m.home_faqs_items_item_5_answer(),
      },
      {
        question: m.home_faqs_items_item_6_question(),
        answer: m.home_faqs_items_item_6_answer(),
      },
      {
        question: m.home_faqs_items_item_7_question(),
        answer: m.home_faqs_items_item_7_answer(),
      },
      {
        question: m.home_faqs_items_item_8_question(),
        answer: m.home_faqs_items_item_8_answer(),
      },
    ];
    return {
      ...metadata,
      scripts: [
        jsonLdScript(faqStructuredData(faqs)),
        jsonLdScript(siteStructuredData()),
      ],
    };
  },
  component: HomePage,
});
