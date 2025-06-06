# exploring reciprocal human-machine learning with a decision engine
based on this [research paper](https://pubsonline.informs.org/doi/10.1287/mnsc.2022.03518)

### notes
- We follow a basic utilitarian decision policy. That is, we select the human vs machine operator based on their respective expected utility. Calculated as follows:

<br/>

Human utility:
$$
U_human = P_correct,human - C_human
$$

Machine utility:
$$
U_machine = P_correct,machine - C_machine
$$

Allocation rule:
$$
argmax(U_human, U_machine)
$$

- the policy outcomes are determined primarily by the machine and human performance. Based on confidence levels
   - Machine confidence = P_correct,machine
   - Human P_correct =  past performance + task expertise
   - Uncertainty is the key driver. Low confidence always delegated to human

### supporting references
- [Ironies of automation](https://ckrybus.com/static/papers/Bainbridge_1983_Automatica.pdf)