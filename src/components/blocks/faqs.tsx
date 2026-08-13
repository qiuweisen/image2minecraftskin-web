import { m } from '@/locale/paraglide/messages';
import { HeaderSection } from '@/components/shared/header-section';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import Container from '@/components/layout/container';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
export default function FaqSection() {
  const faqItems = [
    {
      id: 'item-1',
      question: m.home_faqs_items_item_1_question(),
      answer: m.home_faqs_items_item_1_answer(),
    },
    {
      id: 'item-2',
      question: m.home_faqs_items_item_2_question(),
      answer: m.home_faqs_items_item_2_answer(),
    },
    {
      id: 'item-3',
      question: m.home_faqs_items_item_3_question(),
      answer: m.home_faqs_items_item_3_answer(),
    },
    {
      id: 'item-4',
      question: m.home_faqs_items_item_4_question(),
      answer: m.home_faqs_items_item_4_answer(),
    },
    {
      id: 'item-5',
      question: m.home_faqs_items_item_5_question(),
      answer: m.home_faqs_items_item_5_answer(),
    },
    {
      id: 'item-6',
      question: m.home_faqs_items_item_6_question(),
      answer: m.home_faqs_items_item_6_answer(),
    },
    {
      id: 'item-7',
      question: m.home_faqs_items_item_7_question(),
      answer: m.home_faqs_items_item_7_answer(),
    },
    {
      id: 'item-8',
      question: m.home_faqs_items_item_8_question(),
      answer: m.home_faqs_items_item_8_answer(),
    },
  ];
  return (
    <section id="faqs" className="px-4 py-16 md:py-24">
      <Container className="px-2">
        <ScrollReveal>
          <HeaderSection titleAs="h2" title={m.home_faqs_title()} />
        </ScrollReveal>

        <ScrollReveal delay={150} className="mx-auto mt-10 max-w-4xl">
          <Card>
            <CardContent className="px-4 py-3 sm:px-8">
              <Accordion className="w-full">
                {faqItems.map((item) => (
                  <AccordionItem
                    key={item.id}
                    value={item.id}
                    className="border-dashed"
                  >
                    <AccordionTrigger className="text-base hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-base leading-7 text-muted-foreground">
                        {item.answer}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </ScrollReveal>
      </Container>
    </section>
  );
}
