import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

// Fixed: Removed duplicate process.process reference
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

if (!process.env.GEMINI_API_KEY) {
    console.error('⚠️ WARNING: GEMINI_API_KEY is not set. AI features will not work.');
}

const stripMarkdown = (text) => {
    if (!text) return '';
    let cleaned = text.trim();
    if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json\n?/g, '').replace(/\n?```$/g, '');
    } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```\n?/g, '').replace(/\n?```$/g, '');
    }
    return cleaned.trim();
};

// Helper function that automatically fails over to alternative models on 503 high-demand errors
const generateContentWithFallback = async (prompt) => {
    const models = ['gemini-3.8-flash', 'gemini-3.5-flash-lite', 'gemini-2.5-flash'];
    let lastError = null;

    for (const model of models) {
        try {
            const response = await ai.models.generateContent({
                model,
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                },
            });
            return response;
        } catch (error) {
            lastError = error;
            if (error?.status === 503 || String(error?.message).includes('503')) {
                console.warn(`⚠️ Model ${model} returned 503 (high demand). Trying fallback model...`);
                continue;
            }
            throw error;
        }
    }
    throw lastError;
};

export const generateMonthlyInsight = async ({
    totalIncome = 0,
    totalExpenses = 0,
    savingsRate = 0,
    expenseBreakdown = [],
    previousMonths = [],
    currency = 'INR',
}) => {
    try {
        const breakdownText = expenseBreakdown.length > 0
            ? expenseBreakdown.map(c => `- ${c.category}: ${currency} ${c.amount.toFixed(2)}`).join('\n')
            : '- No expenses recorded yet';

        const trendText = previousMonths.length > 0
            ? previousMonths.map(m => `- ${m.month}: Income ${currency} ${m.income.toFixed(2)}, Expenses ${currency} ${m.expense.toFixed(2)}`).join('\n')
            : '- No previous month data available';

        const prompt = `Analyze this user's monthly financial data and generate actionable insights.

Currency: ${currency}
Total Income (this month): ${currency} ${totalIncome.toFixed(2)}
Total Expenses (this month): ${currency} ${totalExpenses.toFixed(2)}
Savings Rate: ${savingsRate.toFixed(1)}%

Expense breakdown by category (this month):
${breakdownText}

Previous months trend:
${trendText}

Return JSON with this structure:
{
  "summary": "2-3 sentence summary of the user's financial health this month",
  "highlights": ["Positive observation 1", "Positive observation 2"],
  "concerns": ["Concern 1", "Concern 2"],
  "recommendations": [
    {"title": "Short title", "detail": "Actionable suggestion (1-2 sentences)"}
  ],
  "topSpendingCategory": "Category name or null",
  "estimatedMonthlySavings": number,
  "healthScore": number
}`;

        const response = await generateContentWithFallback(prompt);
        const cleaned = stripMarkdown(response.text);
        return JSON.parse(cleaned);
    } catch (error) {
        console.error('Gemini API error (monthly insight):', error);
        throw new Error('Failed to generate monthly insight. Please try again.');
    }
};

export const generateSavingsTips = async ({ topCategories = [], monthlyIncome = 0, currency = 'INR' }) => {
    try {
        const categoryText = topCategories.length > 0
            ? topCategories.map(c => `- ${c.category}: ${currency} ${c.amount.toFixed(2)} across ${c.transactionCount} transactions`).join('\n')
            : '- No spending data available';

        const prompt = `Generate personalized savings tips for a user.

Monthly Income (last 30 days): ${currency} ${monthlyIncome.toFixed(2)}
Top spending categories (last 30 days):
${categoryText}

Return JSON with this structure:
{
  "overallTip": "Top-level 1-sentence advice",
  "tips": [
    {
      "category": "Category this targets",
      "title": "Short tip title",
      "detail": "2-3 sentence actionable suggestion",
      "estimatedSavings": number
    }
  ]
}`;

        const response = await generateContentWithFallback(prompt);
        const cleaned = stripMarkdown(response.text);
        return JSON.parse(cleaned);
    } catch (error) {
        console.error('Gemini API error (savings tips):', error);
        throw new Error('Failed to generate savings tips.');
    }
};

export const generateBudgetAlert = async ({
    categoryName,
    budgetAmount,
    spentAmount,
    daysIntoPeriod,
    totalPeriodDays,
    currency = 'INR',
}) => {
    try {
        const percentUsed = ((spentAmount / budgetAmount) * 100).toFixed(1);
        const daysLeft = totalPeriodDays - daysIntoPeriod;

        const prompt = `A user is tracking a budget. Generate a helpful alert.

Category: ${categoryName}
Budget: ${currency} ${budgetAmount.toFixed(2)}
Spent so far: ${currency} ${spentAmount.toFixed(2)} (${percentUsed}% used)
Days into period: ${daysIntoPeriod} of ${totalPeriodDays} (${daysLeft} days remaining)

Return JSON with this structure:
{
  "severity": "info|warning|critical",
  "title": "Short alert title",
  "message": "1-2 sentence empathetic message referencing actual numbers",
  "suggestions": ["Specific action 1", "Specific action 2", "Specific action 3"]
}`;

        const response = await generateContentWithFallback(prompt);
        const cleaned = stripMarkdown(response.text);
        return JSON.parse(cleaned);
    } catch (error) {
        console.error('Gemini API error (budget alert):', error);
        throw new Error('Failed to generate budget alert.');
    }
};

export const analyzeTransactionList = async ({ transactions = [], currency = 'INR' }) => {
    try {
        const formatDate = (d) => {
            if (!d) return '';
            if (d instanceof Date) {
                const y = d.getFullYear();
                const m = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                return `${y}-${m}-${day}`;
            }
            return String(d).split('T')[0];
        };

        const safeTransactions = Array.isArray(transactions) ? transactions : [];
        const lines = safeTransactions
            .slice(0, 50)
            .map((t) => {
                const date = formatDate(t.transaction_date);
                const amt = parseFloat(t.amount || 0).toFixed(2);
                const cat = t.category_name || 'Uncategorized';
                const desc = t.description ? ` | ${t.description}` : '';
                return `- ${date}: ${t.type} ${currency} ${amt} | ${cat}${desc}`;
            })
            .join('\n');

        const prompt = `Analyze these transactions and provide a spending insight.

Transactions:
${lines || 'No transactions listed.'}

Return JSON with this structure:
{
  "insight": "2-4 sentence analysis with specific numbers from the data. Tone: friendly, helpful.",
  "highlight": "Single short phrase capturing the key takeaway"
}`;

        const response = await generateContentWithFallback(prompt);
        const cleaned = stripMarkdown(response.text);
        return JSON.parse(cleaned);
    } catch (error) {
        console.error('Gemini API error (analyze transactions):', error);
        throw new Error('Failed to analyze transactions.');
    }
};

export const analyzeBudgetList = async ({ budgets = [], currency = 'INR' }) => {
    try {
        const safeBudgets = Array.isArray(budgets) ? budgets : [];
        const lines = safeBudgets.map((b) => {
            const spent = parseFloat(b.spent || 0);
            const total = parseFloat(b.amount || 0);
            const pct = total > 0 ? ((spent / total) * 100).toFixed(1) : '0';
            return `Budget ID ${b.id} | Category: ${b.category_name} | Limit: ${currency} ${total.toFixed(2)} | Spent: ${currency} ${spent.toFixed(2)} (${pct}%)`;
        }).join('\n');

        const prompt = `Analyze each budget below and provide a one-sentence assessment.

Today: ${new Date().toISOString().split('T')[0]}

Budgets:
${lines || 'No budgets configured.'}

Return JSON with this structure:
{
  "analyses": [
    { "budgetId": number, "status": "good"|"caution"|"concerning", "message": "string" }
  ]
}`;

        const response = await generateContentWithFallback(prompt);
        const cleaned = stripMarkdown(response.text);
        return JSON.parse(cleaned);
    } catch (error) {
        console.error('Gemini API error (analyze budgets):', error);
        throw new Error('Failed to analyze budgets.');
    }
};

export default {
    generateBudgetAlert,
    generateMonthlyInsight,
    generateSavingsTips,
    analyzeBudgetList,
    analyzeTransactionList,
};
