import { ChildAccount } from './types';

export function generateAIResponse(
  role: 'parent' | 'teen' | 'site',
  query: string,
  child: ChildAccount,
  allChildren?: ChildAccount[]
): string {
  const q = (query || '').toLowerCase();
  const childName = child.name;

  if (role === 'parent') {
    if (q.includes('all') || q.includes('family') || q.includes('overview') || q.includes('compare')) {
      if (allChildren && allChildren.length > 1) {
        const summaries = allChildren
          .map((c) => `${c.name}: ₹${c.spent}/₹${c.allowance} spent (${Math.round((c.spent / c.allowance) * 100)}%), ₹${c.saved} saved`)
          .join(' | ');
        return `👨‍👩‍👧‍👦 Family Overview: ${summaries}. Overall savings rate is healthy across all children.`;
      }
    }

    if (q.includes('spend') || q.includes('audit') || q.includes('pattern') || q.includes('analysis')) {
      const pct = Math.round((child.spent / child.allowance) * 100);
      const foodPct = Math.round((child.foodSpent / child.foodLimit) * 100);
      return `📊 Spending Audit for ${childName}: ${childName} has used ₹${child.spent.toLocaleString('en-IN')} of the ₹${child.allowance.toLocaleString('en-IN')} allowance (${pct}%). Food & dining is at ₹${child.foodSpent}/₹${child.foodLimit} (${foodPct}%). Recommendation: Set a weekly guideline for canteen and snacking to maintain savings pace.`;
    }

    if (q.includes('goal') || q.includes('target') || q.includes('plan')) {
      const primaryGoal = child.goals[0] || { name: 'Savings Goal', current: child.saved, target: 1000 };
      const rem = Math.max(0, primaryGoal.target - primaryGoal.current);
      const pct = Math.round((primaryGoal.current / primaryGoal.target) * 100);
      const weeks = Math.ceil(rem / 75) || 2;
      return `🎯 Goal Plan for ${childName}: Current target "${primaryGoal.name}" is ${pct}% complete (₹${primaryGoal.current.toLocaleString('en-IN')} / ₹${primaryGoal.target.toLocaleString('en-IN')}). ${childName} is ₹${rem.toLocaleString('en-IN')} away (~${weeks} weeks). Consider a matching reward for the final 15%!`;
    }

    if (q.includes('food') || q.includes('snack') || q.includes('guardrail')) {
      const remFood = Math.max(0, child.foodLimit - child.foodSpent);
      return `🍔 Food & Dining for ${childName}: ₹${remFood} remaining in the category limit. Praise ${childName} for recording expenses regularly, and encourage mindful discretionary spending.`;
    }

    if (q.includes('chore') || q.includes('earn') || q.includes('work') || q.includes('allowance')) {
      return `🗣️ Chores & Allowance Framework: Keep base allowance separate from routine household responsibilities. Offer special top-ups for proactive family help, such as organizing shared storage or helping siblings with study projects.`;
    }

    if (q.includes('wants') || q.includes('need') || q.includes('impulse')) {
      return `⚖️ Managing Wants vs Needs: When ${childName} requests non-essential items, ask: "Which category does this use, and will this delay your savings goal?" This develops natural prioritization without conflict.`;
    }

    return `✦ Family Money Coach for ${childName}: ${childName} has maintained a ${child.streakDays}-day streak of tracking financial choices with total savings of ₹${child.saved.toLocaleString('en-IN')}. A brief weekly review together will reinforce these healthy budgeting habits!`;
  } else if (role === 'teen') {
    if (q.includes('goal') || q.includes('target') || q.includes('fast') || q.includes('soon')) {
      const primaryGoal = child.goals[0] || { name: 'Goal', current: child.saved, target: 1000 };
      const rem = Math.max(0, primaryGoal.target - primaryGoal.current);
      return `🎧 Goal Acceleration Tip: You're at ₹${primaryGoal.current.toLocaleString('en-IN')} of ₹${primaryGoal.target.toLocaleString('en-IN')}, only ₹${rem.toLocaleString('en-IN')} away! Trimming just ₹40 from weekly snacks will shave 2 weeks off your goal time!`;
    }

    if (q.includes('food') || q.includes('snack') || q.includes('canteen')) {
      const remFood = Math.max(0, child.foodLimit - child.foodSpent);
      return `🍔 Smart Food Hack: You have ₹${remFood} remaining in your food budget. Bringing snacks from home twice a week leaves extra room for weekend outings with friends!`;
    }

    if (q.includes('need') || q.includes('want') || q.includes('buy')) {
      return `⚖️ The 3-Question Test: 1) Will I use this for more than 2 weeks? 2) Do I already own something similar? 3) Does this purchase slow down my main savings goal? If it does, pause 24 hours first!`;
    }

    if (q.includes('earn') || q.includes('extra') || q.includes('money')) {
      return `🚀 Ways for Teens to Earn: 1) Help family or neighbors with tech setups. 2) Ask parents for paid weekend special projects (like vehicle detailing). 3) Tutor younger classmates in subjects you enjoy!`;
    }

    return `💡 Smart Teen Money Tip: "Pay yourself first!" Whenever your allowance arrives, set aside a portion immediately into your savings goal before spending. Your future self will thank you!`;
  } else {
    // Landing page AI
    if (q.includes('how') || q.includes('work')) {
      return `Pocket Fund connects parents and teenagers through a guided financial loop: parents set recurring allowances, spending rules, and monitor multiple children; teenagers budget, set goals, and request funds; parents review and approve via UPI; both track progress together.`;
    }
    if (q.includes('safety') || q.includes('upi') || q.includes('safe')) {
      return `Yes, absolutely. Pocket Fund uses parent-authorized companion profiles and strict spending limits enabled through licensed financial partners. Teenagers cannot incur debt or make unauthorized transfers outside verified boundaries.`;
    }
    if (q.includes('age') || q.includes('amount') || q.includes('multiple')) {
      return `Pocket Fund supports multiple children accounts under one parent dashboard! Parents can tailor distinct allowances, limits, and goals for each child (e.g., ages 12 to 17) with dedicated tracking.`;
    }
    if (q.includes('contact') || q.includes('support') || q.includes('care') || q.includes('phone') || q.includes('helpline') || q.includes('call') || q.includes('leader') || q.includes('founder') || q.includes('utkarsh')) {
      return `📞 You can reach Pocket Fund Customer Support & connect directly to Lead Founder Utkarsh Yadav at +91 9554460651 (Mon–Sun 8:00 AM – 10:00 PM IST) or by email at utkarshyadav752@gmail.com. Our Lucknow leadership team is here to assist families and pilot members!`;
    }
    return `Pocket Fund replaces random cash transfers with a structured, educational money routine. Parents manage all their children with real-time approval controls, while teenagers build genuine financial confidence!`;
  }
}
