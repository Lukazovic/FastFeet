import * as Yup from 'yup';

import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number(),
      complement: Yup.string(),
      state: Yup.string().required().length(2),
      city: Yup.string().required(),
      zip_code: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    try {
      const {
        name,
        street,
        number,
        complement,
        state,
        city,
        zip_code,
      } = await Recipient.create(req.body);

      return res.json({
        name,
        street,
        number,
        complement,
        state,
        city,
        zip_code,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      street: Yup.string(),
      number: Yup.number(),
      complement: Yup.string(),
      state: Yup.string().length(2),
      city: Yup.string().when('state', (state, field) =>
        state ? field.required() : field
      ),
      zip_code: Yup.string()
        .when('state', (state, field) => (state ? field.required() : field))
        .when('city', (city, field) => (city ? field.required() : field)),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;
    try {
      const recipient = await Recipient.findByPk(id);

      if (!recipient) {
        return res.status(404).json({ error: 'Recipient not found' });
      }

      await recipient.update(req.body);

      return res.json(recipient);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

export default new RecipientController();
