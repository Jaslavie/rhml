# exploring reciprocal human-machine learning 
based on this [research paper](https://pubsonline.informs.org/doi/10.1287/mnsc.2022.03518)

### notes
- We follow a basic utilitarian decision policy. That is, we select the human vs machine operator based on their respective expected utility. Calculated as follows:

<br/>

Human utility:
$$
U_{\text{human}} = P_{\text{correct,human}} - C_{\text{human}}
$$

Machine utility:
$$
U_{\text{machine}} = P_{\text{correct,machine}} - C_{\text{machine}}
$$

Allocation rule:
$$
\text{Assign to:} \quad \arg\max \left( U_{\text{human}}, U_{\text{machine}} \right)
$$

- the policy outcomes are determined primarily by the machine and human performance. Based on confidence levels
   - Machine confidence = P_correct,machine
   - Human P_correct =  past performance + task expertise
   - Uncertainty is the key driver. Low confidence always delegated to human

### supporting references
- [Ironies of automation](https://ckrybus.com/static/papers/Bainbridge_1983_Automatica.pdf)