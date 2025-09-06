import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface EquationsAccordionProps {
  title?: string;
  className?: string;
}

export function EquationsAccordion({ 
  title = "📊 Model Equations & Theory",
  className = ""
}: EquationsAccordionProps) {
  return (
    <Accordion type="single" collapsible className={`w-full ${className}`}>
      <AccordionItem value="equations">
        <AccordionTrigger className="text-lg font-semibold">
          {title}
        </AccordionTrigger>
        <AccordionContent className="space-y-6 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Production Function */}
            <Card>
              <CardHeader>
                <CardTitle className="text-purple-600 text-lg">Production Function</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <BlockMath math="Y = A \cdot K^{\alpha} \cdot L^{1-\alpha}" />
                </div>
                <div className="text-sm space-y-2">
                  <p><strong>Where:</strong></p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li><InlineMath math="Y" /> = Output (GDP)</li>
                    <li><InlineMath math="A" /> = Technology level</li>
                    <li><InlineMath math="K" /> = Capital stock</li>
                    <li><InlineMath math="L" /> = Labor force</li>
                    <li><InlineMath math="\alpha" /> = Capital share (0 &lt; α &lt; 1)</li>
                  </ul>
                  <p className="text-xs mt-2"><em>This Cobb-Douglas function shows how capital and labor combine to produce output, with technology amplifying productivity.</em></p>
                </div>
              </CardContent>
            </Card>

            {/* Capital Accumulation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-purple-600 text-lg">Capital Accumulation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <BlockMath math="\dot{K} = sY - \delta K" />
                </div>
                <div className="text-sm space-y-2">
                  <p><strong>Where:</strong></p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li><InlineMath math="\dot{K}" /> = Change in capital stock</li>
                    <li><InlineMath math="s" /> = Savings rate</li>
                    <li><InlineMath math="Y" /> = Output</li>
                    <li><InlineMath math="\delta" /> = Depreciation rate</li>
                  </ul>
                  <p className="text-xs mt-2"><em>Capital grows through investment (savings) but shrinks due to depreciation.</em></p>
                </div>
              </CardContent>
            </Card>

            {/* Technology & Population Growth */}
            <Card>
              <CardHeader>
                <CardTitle className="text-purple-600 text-lg">Growth Dynamics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <BlockMath math="A_t = A_0 e^{gt}" />
                  <BlockMath math="L_t = L_0 e^{nt}" />
                </div>
                <div className="text-sm space-y-2">
                  <p><strong>Where:</strong></p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li><InlineMath math="g" /> = Technology growth rate</li>
                    <li><InlineMath math="n" /> = Population growth rate</li>
                    <li><InlineMath math="t" /> = Time</li>
                  </ul>
                  <p className="text-xs mt-2"><em>Technology and population grow exponentially over time, driving long-term economic growth.</em></p>
                </div>
              </CardContent>
            </Card>

            {/* Steady State */}
            <Card>
              <CardHeader>
                <CardTitle className="text-purple-600 text-lg">Steady-State Capital</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <BlockMath math="k^* = \left(\frac{s}{n + g + \delta}\right)^{\frac{1}{1-\alpha}}" />
                </div>
                <div className="text-sm space-y-2">
                  <p><strong>Where:</strong></p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li><InlineMath math="k^*" /> = Steady-state capital per effective worker</li>
                    <li><InlineMath math="n + g + \delta" /> = Effective depreciation rate</li>
                  </ul>
                  <p className="text-xs mt-2"><em>The economy converges to this steady-state where capital per worker grows at rate g.</em></p>
                </div>
              </CardContent>
            </Card>

            {/* Output Gap */}
            <Card>
              <CardHeader>
                <CardTitle className="text-purple-600 text-lg">Output Gap</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <BlockMath math="\text{gap}_t = \text{growth}_t - 0.02" />
                </div>
                <div className="text-sm space-y-2">
                  <p><strong>Where:</strong></p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li><InlineMath math="\text{gap}_t" /> = Output gap at time t</li>
                    <li><InlineMath math="\text{growth}_t" /> = Actual GDP growth rate</li>
                    <li><InlineMath math="0.02" /> = Potential GDP growth rate (2%)</li>
                  </ul>
                  <p className="text-xs mt-2"><em>Positive gap indicates economy above potential (overheating), negative gap indicates recession.</em></p>
                </div>
              </CardContent>
            </Card>

            {/* Unemployment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-purple-600 text-lg">Unemployment (Okun's Law)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <BlockMath math="u_t = u_{t-1} - 0.5 \times \text{gap}_t + \epsilon_t" />
                </div>
                <div className="text-sm space-y-2">
                  <p><strong>Where:</strong></p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li><InlineMath math="u_t" /> = Unemployment rate at time t</li>
                    <li><InlineMath math="\text{gap}_t" /> = Output gap (from equation above)</li>
                    <li><InlineMath math="\epsilon_t" /> = Random shock (±0.25%)</li>
                    <li><InlineMath math="0.5" /> = Okun's coefficient</li>
                  </ul>
                  <p className="text-xs mt-2"><em>Unemployment falls when output exceeds potential (negative gap) and rises during recessions. Bounded between 2% and 100%.</em></p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Key Insights:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Higher savings rate → More capital accumulation → Higher output per worker</li>
              <li>• Higher depreciation → Faster capital decay → Lower steady-state capital</li>
              <li>• Technology growth drives long-term per-capita income growth</li>
              <li>• Population growth dilutes capital per worker but increases total output</li>
              <li>• Output gap measures how far the economy is from its 2% potential growth rate</li>
              <li>• Unemployment responds to economic cycles via Okun's Law (output gap relationship)</li>
            </ul>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}